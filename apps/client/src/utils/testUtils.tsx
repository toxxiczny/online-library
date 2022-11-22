import type { RenderOptions } from '@testing-library/react'
import { render as _render } from '@testing-library/react'
import axios from 'axios'
import type { ReactElement } from 'react'

import { SERVER_URL } from '@online-library/config'

import { Providers } from 'components/shared'

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

type Options = Omit<RenderOptions, 'wrapper'>

axios.defaults.baseURL = SERVER_URL

export const render = (ui: ReactElement, options?: Options) =>
   _render(ui, {
      wrapper: ({ children }) => <Providers rtl>{children}</Providers>,
      ...options,
   })