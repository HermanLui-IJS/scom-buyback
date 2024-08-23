import { Module, customModule, Container, application } from '@ijstech/components';
import { getMulticallInfoList } from '@scom/scom-multicall';
import { INetwork } from '@ijstech/eth-wallet';
import getNetworkList from '@scom/scom-network-list';
import ScomBuyback from '@scom/scom-buyback';
import ScomWidgetTest from '@scom/scom-widget-test';

@customModule
export default class Module1 extends Module {
    private buybackElm: ScomBuyback;
    private widgetModule: ScomWidgetTest;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        const multicalls = getMulticallInfoList();
        const networkMap = this.getNetworkMap(options.infuraId);
        application.store = {
            infuraId: options.infuraId,
            multicalls,
            networkMap
        }
    }

    private getNetworkMap = (infuraId?: string) => {
        const networkMap = {};
        const defaultNetworkList: INetwork[] = getNetworkList();
        const defaultNetworkMap: Record<number, INetwork> = defaultNetworkList.reduce((acc, cur) => {
            acc[cur.chainId] = cur;
            return acc;
        }, {});
        for (const chainId in defaultNetworkMap) {
            const networkInfo = defaultNetworkMap[chainId];
            const explorerUrl = networkInfo.blockExplorerUrls && networkInfo.blockExplorerUrls.length ? networkInfo.blockExplorerUrls[0] : "";
            if (infuraId && networkInfo.rpcUrls && networkInfo.rpcUrls.length > 0) {
                for (let i = 0; i < networkInfo.rpcUrls.length; i++) {
                    networkInfo.rpcUrls[i] = networkInfo.rpcUrls[i].replace(/{INFURA_ID}/g, infuraId);
                }
            }
            networkMap[networkInfo.chainId] = {
                ...networkInfo,
                symbol: networkInfo.nativeCurrency?.symbol || "",
                explorerTxUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}tx/` : "",
                explorerAddressUrl: explorerUrl ? `${explorerUrl}${explorerUrl.endsWith("/") ? "" : "/"}address/` : ""
            }
        }
        return networkMap;
    }

    private async onShowConfig() {
        const editor = this.buybackElm.getConfigurators().find(v => v.target === 'Editor');
        const widgetData = await editor.getData();
        if (!this.widgetModule) {
            this.widgetModule = await ScomWidgetTest.create({
                widgetName: 'scom-buyback',
                onConfirm: (data: any, tag: any) => {
                    editor.setData(data);
                    editor.setTag(tag);
                    this.widgetModule.closeModal();
                }
            });
        }
        this.widgetModule.openModal({
            width: '90%',
            maxWidth: '90rem',
            padding: { top: 0, bottom: 0, left: 0, right: 0 },
            closeOnBackdropClick: true,
            closeIcon: null
        });
        this.widgetModule.show(widgetData);
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-vstack
                margin={{ top: '1rem', left: '1rem', right: '1rem' }}
                gap="1rem"
            >
                <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
                <i-scom-buyback
                    id="buybackElm"
                    defaultChainId={97}
                    chainId={97}
                    title="OSwap IDO Buyback"
                    logo="https://ipfs.scom.dev/ipfs/bafkreigsu7udzf7sdoyspnvdinm7vh42ihhfs4vwcvibqkozrckgdtp3ve"
                    offerIndex={36}
                    tokenIn="0x45eee762aaeA4e5ce317471BDa8782724972Ee19"
                    tokenOut="0xDe9334C157968320f26e449331D6544b89bbD00F"
                    networks={[
                        {
                            chainId: 43113
                        },
                        {
                            chainId: 97
                        }
                    ]}
                    wallets={[
                        {
                            name: "metamask"
                        }
                    ]}
                />
            </i-vstack>
        </i-panel>
    }
}