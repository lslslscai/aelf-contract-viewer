import {
  getSignParams,
  getTxResult,
} from '../../common/utils';
import { request } from '../../../../common/request';
import {
  API_PATH
} from '../../common/constants';

import { deserializeLog } from '../../../../common/utils';


export function getCsrfToken() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)csrfToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
}

export async function updateContractName(wallet, currentWallet, params) {
  const signedParams = await getSignParams(wallet, currentWallet);
  if (Object.keys(signedParams).length > 0) {
    return request(API_PATH.UPDATE_CONTRACT_NAME, {
      ...params,
      ...signedParams,
    }, {
      headers: {
        'x-csrf-token': getCsrfToken()
      }
    });
  }
  throw new Error('get signature failed');
}

export async function addContractName(wallet, currentWallet, params) {
  const signedParams = await getSignParams(wallet, currentWallet);
  if (Object.keys(signedParams).length > 0) {
    return request(API_PATH.ADD_CONTRACT_NAME, {
      ...params,
      ...signedParams,
    }, {
      headers: {
        'x-csrf-token': getCsrfToken()
      }
    });
  }
  throw new Error('get signature failed');
}


export async function getDeserializeLog(aelf, txId, logName) {
  if (!txId) throw new Error('get not get txId');
  const txResult = await getTxResult(aelf, txId ?? '');
  if (txResult.Status === 'MINED') {
    const {
      Logs = []
    } = txResult;
    const log = (Logs || []).filter(v => v.Name === logName);
    if (log.length === 0) {
      return;
    }
    const result = await deserializeLog(log[0], log[0].Name, log[0].Address);
    // eslint-disable-next-line consistent-return
    return result;
  }
}
