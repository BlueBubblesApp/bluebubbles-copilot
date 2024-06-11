export default {
    name: 'help',
    type: 1,
    description: 'Quickly figure out how to solve an issue with BlueBubbles',
    version: 1,
    autocomplete: true,
    options: [
        {
            type: 3,
            name: 'article',
            description: 'The help article you are looking for',
            required: true,
            choices: [
                {
                    'name': 'Install',
                    'value': 'install'
                },
                {
                    'name': 'Documentation',
                    'value': 'docs'
                },
                {
                    'name': 'Troubleshooting',
                    'value': 'troubleshooting'
                },
                {
                    'name': 'FAQ',
                    'value': 'faq'
                },
                {
                    'name': 'Source Code',
                    'value': 'source_code'
                },
                {
                    'name': 'Donate',
                    'value': 'donate'
                },
                {
                    'name': 'Sponsor Us',
                    'value': 'sponsor'
                },
                {
                    'name': 'Report a Bug',
                    'value': 'report_bug'
                },
                {
                    'name': 'Request a Feature',
                    'value': 'request_feature'
                },
                {
                    'name': 'Phone Number Registration',
                    'value': 'phone_registration'
                },
                {
                    'name': 'Not Receiving Notifications',
                    'value': 'no_notifications'
                },
                {
                    'name': 'macOS Virtualization (VM)',
                    'value': 'mac_virtualization'
                },
                {
                    'name': 'Private API',
                    'value': 'private_api'
                },
                {
                    'name': 'GitHub App Release',
                    'value': 'github_app_release'
                },
                {
                    'name': 'GitHub Server Release',
                    'value': 'github_server_release'
                },
                {
                    'name': 'Play Store Release',
                    'value': 'play_store'
                },
                {
                    'name': 'Microsoft Store Release',
                    'value': 'microsoft_store'
                },
                {
                    'name': 'Tailscale VPN',
                    'value': 'tailscale'
                },
                {
                    'name': 'Docker OSX',
                    'value': 'docker_osx'
                }
            ]
        }
    ]
};