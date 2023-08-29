import ScomNetworkPicker from '@scom/scom-network-picker';
import ScomTokenInput from '@scom/scom-token-input';

const theme = {
    type: 'object',
    properties: {
        backgroundColor: {
            type: 'string',
            format: 'color'
        },
        fontColor: {
            type: 'string',
            format: 'color'
        },
        inputBackgroundColor: {
            type: 'string',
            format: 'color'
        },
        inputFontColor: {
            type: 'string',
            format: 'color'
        },
        // buttonBackgroundColor: {
        // 	type: 'string',
        // 	format: 'color'
        // },
        // buttonFontColor: {
        // 	type: 'string',
        // 	format: 'color'
        // },
        // secondaryColor: {
        //     type: 'string',
        //     title: 'Timer Background Color',
        //     format: 'color'
        // },
        // secondaryFontColor: {
        //     type: 'string',
        //     title: 'Timer Font Color',
        //     format: 'color'
        // }
    }
}

export default {
    dataSchema: {
        type: 'object',
        properties: {
            title: {
                type: 'string'
            },
            logo: {
                type: 'string',
                format: 'data-url'
            },
            offerIndex: {
                type: 'number',
                required: true
            },
            chainId: {
                type: 'number',
                required: true
            },
            tokenIn: {
                type: 'string',
                required: true
            },
            tokenOut: {
                type: 'string',
                required: true
            },
            dark: theme,
            light: theme
        }
    },
    uiSchema: {
        type: 'Categorization',
        elements: [
            {
                type: 'Category',
                label: 'General',
                elements: [
                    {
                        type: 'VerticalLayout',
                        elements: [
                            {
                                type: 'Control',
                                scope: '#/properties/title'
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/logo'
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/offerIndex'
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/chainId'
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/tokenIn'
                            },
                            {
                                type: 'Control',
                                scope: '#/properties/tokenOut'
                            }
                        ]
                    }
                ]
            },
            {
                type: 'Category',
                label: 'Theme',
                elements: [
                    {
                        type: 'VerticalLayout',
                        elements: [
                            {
                                type: 'Control',
                                label: 'Dark',
                                scope: '#/properties/dark'
                            },
                            {
                                type: 'Control',
                                label: 'Light',
                                scope: '#/properties/light'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    customControls(rpcWalletId: string) {
        let networkPicker: ScomNetworkPicker;
        let firstTokenInput: ScomTokenInput;
        let secondTokenInput: ScomTokenInput;
        return {
            "#/properties/chainId": {
                render: () => {
                    networkPicker = new ScomNetworkPicker(undefined, {
                        type: 'combobox',
                        networks: [1, 56, 137, 250, 97, 80001, 43113, 43114].map(v => { return { chainId: v } }),
                        onCustomNetworkSelected: () => {
                            const chainId = networkPicker.selectedNetwork?.chainId;
                            firstTokenInput.targetChainId = chainId;
                            secondTokenInput.targetChainId = chainId;
                        }
                    });
                    return networkPicker;
                },
                getData: (control: ScomNetworkPicker) => {
                    return control.selectedNetwork?.chainId;
                },
                setData: (control: ScomNetworkPicker, value: number) => {
                    control.setNetworkByChainId(value);
                    if (firstTokenInput) firstTokenInput.targetChainId = value;
                    if (secondTokenInput) secondTokenInput.targetChainId = value;
                }
            },
            "#/properties/tokenIn": {
                render: () => {
                    firstTokenInput = new ScomTokenInput(undefined, {
                        type: 'combobox',
                        isBalanceShown: false,
                        isBtnMaxShown: false,
                        isInputShown: false,
                        maxWidth: 300
                    });
                    firstTokenInput.rpcWalletId = rpcWalletId;
                    const chainId = networkPicker?.selectedNetwork?.chainId;
                    if (chainId && firstTokenInput.targetChainId !== chainId) {
                        firstTokenInput.targetChainId = chainId;
                    }
                    return firstTokenInput;
                },
                getData: (control: ScomTokenInput) => {
                    return control.token?.address || control.token?.symbol;
                },
                setData: (control: ScomTokenInput, value: string) => {
                    control.address = value;
                }
            },
            "#/properties/tokenOut": {
                render: () => {
                    secondTokenInput = new ScomTokenInput(undefined, {
                        type: 'combobox',
                        isBalanceShown: false,
                        isBtnMaxShown: false,
                        isInputShown: false,
                        maxWidth: 300
                    });
                    secondTokenInput.rpcWalletId = rpcWalletId;
                    const chainId = networkPicker?.selectedNetwork?.chainId;
                    if (chainId && secondTokenInput.targetChainId !== chainId) {
                        secondTokenInput.targetChainId = chainId;
                    }
                    return secondTokenInput;
                },
                getData: (control: ScomTokenInput) => {
                    return control.token?.address || control.token?.symbol;
                },
                setData: (control: ScomTokenInput, value: string) => {
                    control.address = value;
                }
            }
        }

    }
}