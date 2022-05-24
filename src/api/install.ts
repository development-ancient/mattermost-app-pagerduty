import {Request, Response} from 'express';
import {AppCallResponse} from '../types';
import {newOKCallResponseWithMarkdown} from '../utils/call-responses';
import manifest from '../manifest.json';

export const getInstall = async (request: Request, response: Response) => {
    const helpText: string = [
        getCommands()
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getCommands(): string {
    const homepageUrl: string = manifest.homepage_url;
    return `${joinLines(
        `To finish configuring the PagerDuty app please read the [Quick Start](${homepageUrl}#quick-start) section of the README`
    )}\n`;
}

function joinLines(...lines: string[]): string {
    return lines.join('\n');
}
