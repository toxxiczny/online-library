import styled, { css } from 'styled-components/macro'

export default styled.div`
    width: max-content;
    max-width: 70vw;
    word-break: break-all;
    padding: 8px 10px;
    margin-bottom: 10px;
    white-space: pre-line;
    font-size: 15px;
    border-radius: 12px;
    color: white;
    background: rgba(0, 136, 255, 0.4);
    align-self: flex-end;
    position: relative;
    @media (max-width: 1000px) {
        font-size: 14px;
    }
    @media (max-width: 700px) {
        font-size: 13px;
    }
    ${({ withCurrentUser, withLastUserMessage }) =>
        withLastUserMessage &&
        (withCurrentUser
            ? css`
                  border-bottom-left-radius: 2px;
              `
            : css`
                  border-bottom-right-radius: 2px;
              `)}
    ${({ withLastMessage }) =>
        withLastMessage &&
        css`
            margin-bottom: 0px;
        `}
`