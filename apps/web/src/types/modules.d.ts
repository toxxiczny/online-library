/* eslint-disable @typescript-eslint/no-empty-interface */
import type { theme } from '@online-library/core'

import type { RootState } from 'redux/store'

declare module 'react-redux' {
   interface DefaultRootState extends RootState {}
}

type Theme = typeof theme

declare module 'styled-components' {
   export interface DefaultTheme extends Theme {}
}