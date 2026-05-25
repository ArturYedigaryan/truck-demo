import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '#DDDDDD',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '#1C1E41',
            600: '#1C1E41',
            700: '#1C1E41',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        },
    },
    components: {
        inputtext: {
            root: {
                borderColor: '#DDDDDD',
                filledBackground: 'none',
                borderRadius: '8px',

                lg: {
                    paddingX: '12px',
                    paddingY: '13px',
                }
            }
        },
        button: {
            root: {
                lg: {
                    fontSize: '16px',
                    paddingX: '28px',
                    paddingY: '12px',
                },
                sm: {
                    fontSize: '14px',
                    paddingX: '16px',
                    paddingY: '6px',
                },
                label: {
                    fontWeight: '400'
                },
            }
        },
        confirmdialog: {
            icon: {
                size: '18px'
            }
        },
        dialog: {
            header: {
                padding: '16px 24px',

            },
            title: {
                fontSize: '18px'
            },
            footer: {
                padding: '16px 24px'
            },
            content: {
                padding: '24px 24px'
            }
        },
    }
});