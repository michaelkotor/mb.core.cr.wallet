import axios from 'axios'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'


const openWithMnemoic = createAsyncThunk(
  'wallet/openWithMnemoic',
  async (mnemonic, { extra: context }) => {
    try {
      context.wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        context.config.DEFAULT_WALLET_PATH,
        context.config.ADDR_PREFIX
      )

      const account = (await axios.get(
        context.config.getApiUrl(`auth/accounts/${context.wallet.address}`)
      )).data

      const addr2id = (await axios.get(
        context.config.getApiUrl(`metabelarus/mbcorecr/mbcorecr/addr2id/${context.wallet.address}`)
      )).data

      let identity = null
      if (addr2id.Addr2Id?.id) {
        identity = (await axios.get(
          context.config.getApiUrl(`metabelarus/mbcorecr/mbcorecr/identity/${addr2id.Addr2Id?.id}`)
        )).data?.Identity
      }

      context.client = await SigningStargateClient.connectWithSigner(
        context.config.RPC_URL,
        context.wallet,
        {}
      )

      return {
        address: context.wallet.address,
        account: account.result?.value,
        identity,
        mnemonic
      }
    } catch (e) {
      console.log(e)

      throw e
    }
  }
)

const slice = createSlice({
  name: 'wallet',

  initialState: {
    address: null,
    account: null,
    mnemonic: null,
    identity: null,
  },

  reducers: {
    signOut: (state) => {
      return { ...state, address: '', account: '', mnemonic: '' }
    },
  },

  extraReducers: {
    [openWithMnemoic.fulfilled]: (state, action) => {
      return { ...state, ...action.payload }
    }
  }
})


export const walletActions = { ...slice.actions, openWithMnemoic }

export const wallet = slice.reducer