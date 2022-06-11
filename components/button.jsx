import styled from "@emotion/styled";
import Link from "next/link";
import { CELADON_BLUE, FRENCH_BLUE, VIVID_CERULEAN, WHITE } from "./colors";
import { flexbox } from "./layouts";

export const Button = ({
    children, padding = '6px',
    backgroundColor = WHITE,
    textColor = FRENCH_BLUE, hoverText = WHITE,
    uppercase = true,
    click,
}) => {

    const StyledButton = styled.button`
        color : ${textColor};
        padding: ${padding};
        border: 0.75px solid ${textColor};
        background-color: ${backgroundColor};
        border-radius: 0.25rem;
        transition: all ease-in 0.075s;
        font-weight: semi-bold;
        text-transform: ${uppercase ? 'uppercase' : ''};

        &:hover{
            background-color: ${textColor};
            color: ${hoverText};
            border: 0.75px solid ${textColor};
        }
    `

    return (
        <StyledButton onClick={click}>
            {children}
        </StyledButton>
    );
}

export const LinkButton = ({
    children,
    click, href,
    padding="6px",
    textColor=FRENCH_BLUE, hoverColor=VIVID_CERULEAN, activeColor=CELADON_BLUE,
    hoverBackground,
    bold='600',
    underline=false,
}) => {

    const StyledSpan = styled.span`
        color : ${textColor};
        text-decoration: ${underline === true? 'underline' : 'none'};
        padding: ${padding};
        font-weight: ${bold};
        transition: all ease-in 0.075s;
        cursor: pointer;

        :hover {
            color : ${hoverColor}
            ${hoverBackground ? 'background-color : ' + hoverBackground : ''}
        }

        :active {
            color: ${activeColor};
        }
    `

    return (
        <Link href={href} click={click} css={flexbox}>
            <StyledSpan>
                {children}
            </StyledSpan>
        </Link>
    )
}