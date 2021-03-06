import {Request, Response} from 'express';
import {
    CallResponseHandler,
    newErrorCallResponseWithMessage,
    newFormCallResponse,
    newOKCallResponse,
    newOKCallResponseWithData,
    newOKCallResponseWithMarkdown
} from '../utils/call-responses';
import {AppCallRequest, AppCallResponse, Oauth2App} from '../types';
import {hyperlink} from '../utils/markdown';
import {pagerDutyConfigForm, pagerDutyConfigSubmit} from '../forms/configure-admin-account';
import {oauth2Connect, oauth2Complete, oauth2Disconnect} from '../forms/oauth';
import {isConnected, showMessageToMattermost} from "../utils/utils";

export const configureAdminAccountForm: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        const form = await pagerDutyConfigForm(req.body);
        callResponse = newFormCallResponse(form);
        res.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage('Unable to open configuration form: ' + error.message);
        res.json(callResponse);
    }
};

export const configureAdminAccountSubmit: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        await pagerDutyConfigSubmit(req.body);
        callResponse = newOKCallResponseWithMarkdown('Successfully updated PagerDuty configuration');
        res.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage('Error processing form request: ' + error.message);
        res.json(callResponse);
    }
};

export const connectAccountLoginSubmit: CallResponseHandler = async (req: Request, res: Response) => {
    const call: AppCallRequest = req.body;
    const connectUrl: string | undefined = call.context.oauth2?.connect_url;
    const oauth2: Oauth2App | undefined = call.context.oauth2;
    const message: string = isConnected(oauth2)
        ? `You are already logged into PagerDuty with user ${oauth2.user?.user.name}`
        : `Follow this ${hyperlink('link', <string>connectUrl)} to connect Mattermost to your PagerDuty Account.`;
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(message);
    res.json(callResponse);
};

export const fOauth2Connect: CallResponseHandler = async (req:  Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        const url: string = await oauth2Connect(req.body);
        callResponse = newOKCallResponseWithData(url);
        res.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage('Unable to open configuration form: ' + error.message);
        res.json(callResponse);
    }
}

export const fOauth2Complete: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        await oauth2Complete(req.body);
        callResponse = newOKCallResponse();
        res.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage(error.message);
        res.json(callResponse);
    }
}

export const fOauth2Disconnect: CallResponseHandler = async (req: Request, res: Response) => {
    let callResponse: AppCallResponse;

    try {
        await oauth2Disconnect(req.body);
        callResponse = newOKCallResponseWithMarkdown('You have disconnected your PagerDuty account');
        res.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        res.json(callResponse);
    }
}


