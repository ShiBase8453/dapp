import { providers } from 'ethers'
import { useContext } from 'react'
import { ConnectorController } from './connectorController'
import { ConnectorContext } from './context'

export interface UseProviderOptions {
  /**
   * Selects chain id.
   */
  chainId?: number
  /**
   * Selects account
   * '0xabc...' - account address.
   * true - any connector with address
   * 
   */
  account?: boolean | string
}

export interface ConnectorNetwork {
  chainId: number
  accounts: string[]
  provider: providers.BaseProvider | providers.ExternalProvider | providers.Web3Provider
}

export function useConnectorNetwork(opts: UseProviderOptions = {}): ConnectorNetwork | undefined {
  const { connectors } = useContext(ConnectorContext)!

  const connector = connectors.find((c) => matchConnector(opts, c))

  if (!connector || !connector.getProvider()) {
    return undefined
  }

  return {
    chainId: connector.chainId,
    accounts: connector.accounts,
    provider: connector.getProvider()!,
  }
}

function matchConnector(opts: UseProviderOptions, connector: ConnectorController) {
  if (opts.chainId) {
    if (connector.chainId !== opts.chainId) {
      return false
    }
  }

  if (opts.account === true) {
    if (!connector.accounts.length) {
      return false
    }
  } else if (opts.account) {
    if (!connector.accounts.includes(opts.account)) {
      return false
    }
  }

  return true
}
