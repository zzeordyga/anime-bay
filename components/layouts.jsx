import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { RICH_BLACK, WHITE } from './colors';
import { PaddedContent } from './containers';

export const Navbar = ({
    children,
    links = [
        {
            href: "/animes",
            text: "Anime",
        },
        {
            href: "/collections",
            text: "Your Collection",
        },
    ],
    darkMode = false,
}) => {

    const darkCss = css`
        background-color: ${RICH_BLACK};
        color: ${WHITE};
    `

    const StyledNavbar = styled.nav`
        background-color: ${WHITE};

        ${darkMode ? darkCss : 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);'};
    `

    return (
        <StyledNavbar>
            <PaddedContent></PaddedContent>
        </StyledNavbar>
    )
}


