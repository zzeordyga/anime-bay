import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { LG, SM } from "./breakpoints";
import { WHITE } from "./colors";

let getWidth = (span) => {
    if (!span) return;

    let width = span / 12 * 100;
    retun`width: ${width}%;`;
}

export const PaddedContent = ({ children, backgroundColor = 'white' }) => {

    const StyledDiv = styled.div`
        max-width: 80rem;
        background-color: ${backgroundColor};
        margin: 0 auto;
        padding: 0 1rem;

        @media only screen and (min-width: ${SM}){
            padding: 0 1.5rem;
        }

        @media only screen and (min-width: ${LG}){
            padding: 0 2rem;
        }
    `;

    return (
        <StyledDiv>
            {children}
        </StyledDiv>
    );
}


export const Card = ({
    children,
    alignText='center',
    backgroundColor=WHITE,
    borderRadius='0.25rem',
    css,
}) => {

    const StyledCard = styled.div`
        text-align: ${alignText};
        background-color: ${backgroundColor};
        border-radius: ${borderRadius};
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

        ${css}
    `;

    return (
        <StyledCard>
            {children}
        </StyledCard>
    )
}

export const Grid = ({ children, col = 5, gap = '1.5rem' }) => {

    const StyledGrid = styled.div`
        display: grid;
        gap: ${gap};
        grid-template-columns: repeat(${Math.floor(col / 2)}, 1fr);

        & > * {
            grid-column: span 1 / span 1;
        }

        @media only screen and (min-width: ${SM}){
            padding: 0 1.5rem;
            grid-template-columns: repeat(${col}, 1fr);
        }
    `

    return (
        <StyledGrid>
            {children}
        </StyledGrid>
    )
}

export const Flexbox = ({
    children,
    direction = "row",
    wrap = "wrap",
    justify = "start",
    alignment = "center",
    shrink=1,
    grow=1,
}) => {

    const StyledFlex = styled.div`
        display: flex;
        justify-content: ${justify};
        align-items: ${alignment};
        flex-wrap: ${wrap};
        flex-direction: ${direction};
        flex-grow: ${grow};
        flex-shrink: ${shrink};
    `

    return (
        <StyledFlex>
            {children}
        </StyledFlex>
    )
}

export const grid = (col = 5, gap = '1.5rem') => {
    const cssGrid = css`
        display: grid;
        gap: ${gap};
        grid-template-columns: repeat(${Math.floor(col / 2)}, 1fr);

        & > * {
            grid-column: span 1 / span 1;
        }

        @media only screen and (min-width: ${SM}){
            padding: 0 1.5rem;
            grid-template-columns: repeat(${col}, 1fr);
        }
    `

    return cssGrid;
}

export const flexbox = (
    direction = "row",
    wrap = "wrap",
    justify = "start",
    alignment = "center",
    shrink=1,
    grow=1,
) => {

    const cssFlex = css`
        display: flex;
        justify-content: ${justify};
        align-items: ${alignment};
        flex-wrap: ${wrap};
        flex-direction: ${direction};
        flex-grow: ${grow};
        flex-shrink: ${shrink};
    `

    return cssFlex;
}