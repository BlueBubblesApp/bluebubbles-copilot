// Discord Command Config File
// This command will create a github issue on behalf of the user
export default {
    name: 'gh-create-issue',
    type: 1,
    description: 'Create a new issue in one of the BlueBubbles GitHub repositories',
    version: 1,
    autocomplete: true,
    options: [
        {
            type: 3,
            name: 'app_type',
            description: 'The BlueBubbles App that this issue is for',
            required: true,
            choices: [
                {
                    'name': 'Android',
                    'value': 'android'
                },
                {
                    'name': 'Desktop',
                    'value': 'desktop'
                },
                {
                    'name': 'Server',
                    'value': 'server'
                },
                {
                    'name': 'Private API Helper',
                    'value': 'helper'
                },
                {
                    'name': 'Web',
                    'value': 'web'
                }
            ]
        },
        {
            type: 3,
            name: 'title',
            description: 'The title of the issue',
            required: true
        },
        {
            type: 3,
            name: 'description',
            description: 'The description of the issue (be as detailed as possible)',
            required: true
        },
        {
            type: 3,
            name: 'issue_type',
            description: 'The type of issue',
            required: false,
            choices: [
                {
                    'name': 'Bug',
                    'value': 'bug'
                },
                {
                    'name': 'Feature Request',
                    'value': 'feature'
                }
            ]
        },
        {
            type: 11,
            name: 'attachment',
            description: 'A screenshot, video, or other attachment to include with the issue',
            required: false
        }
    ]
};