import styled from 'styled-components/macro'

import { randomImage } from '@online-library/tools'

export const RoleContainer = styled.section`
   min-height: 100%;
   background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
      url(${randomImage}) center center no-repeat;
   background-size: cover;
   backface-visibility: hidden;
   display: flex;
   justify-content: center;
`
