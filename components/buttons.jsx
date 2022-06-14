import styled from "@emotion/styled";
import Link from "next/link";
import { useState } from "react";
import { LG } from "./breakpoints";
import {
  CELADON_BLUE,
  FRENCH_BLUE,
  LIGHT_GREY,
  RICH_BLACK,
  VIVID_CERULEAN,
  WHITE,
} from "./colors";

export const Button = ({
  children,
  padding = "6px",
  backgroundColor = WHITE,
  textColor = FRENCH_BLUE,
  borderColor,
  hoverBorder,
  hoverText = WHITE,
  hoverBackground,
  uppercase = true,
  css,
  click,
  disabled = false,
  isActive = false,
}) => {
  const StyledButton = styled.button`
    color: ${textColor};
    padding: ${padding};
    border: 0.75px solid ${borderColor ? borderColor : textColor};
    background-color: ${backgroundColor};
    border-radius: 0.25rem;
    transition: all ease-in 0.075s;
    font-weight: semi-bold;
    text-transform: ${uppercase ? "uppercase" : ""};

    ${css}

    &:hover {
      background-color: ${hoverBackground ? hoverBackground : textColor};
      color: ${hoverText};
    }

    ${disabled
      ? `
        background-color : ${LIGHT_GREY};
        cursor: auto;
        color : ${RICH_BLACK};

        &:hover {
          background-color: ${LIGHT_GREY};
          color: ${RICH_BLACK};
        }
      `
      : ""}

    ${isActive
      ? `
        background-color: ${textColor};
        color: ${hoverText};
      `
      : ""}
  `;

  return (
    <StyledButton onClick={click} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export const LinkButton = ({
  children,
  click,
  href,
  padding = "6px",
  textColor = FRENCH_BLUE,
  hoverColor = VIVID_CERULEAN,
  activeColor = CELADON_BLUE,
  hoverBackground,
  bold = "600",
  underline = false,
  fontSize = "1rem",
  width = "",
  css,
}) => {
  const StyledSpan = styled.span`
    color: ${textColor};
    text-decoration: ${underline === true ? "underline" : "none"};
    padding: ${padding};
    font-weight: ${bold};
    transition: all ease-in 0.075s;
    cursor: pointer;
    font-size: ${fontSize};
    width: ${width};
    border-radius: 0.25rem;

    ${css}

    :hover {
      color: ${hoverColor};
      ${hoverBackground ? "background-color : " + hoverBackground : ""};
    }

    :active {
      color: ${activeColor};
    }
  `;

  return (
    <Link href={href} click={click}>
      <StyledSpan>{children}</StyledSpan>
    </Link>
  );
};

export const TextButton = ({
  children,
  click,
  href,
  padding = "6px",
  textColor = FRENCH_BLUE,
  hoverColor = VIVID_CERULEAN,
  activeColor = CELADON_BLUE,
  hoverBackground,
  bold = "600",
  underline = false,
  fontSize = "1rem",
  width = "",
  css,
}) => {
  const StyledSpan = styled.span`
    color: ${textColor};
    text-decoration: ${underline === true ? "underline" : "none"};
    padding: ${padding};
    font-weight: ${bold};
    transition: all ease-in 0.075s;
    cursor: pointer;
    font-size: ${fontSize};
    width: ${width};
    border-radius: 0.25rem;

    ${css}

    :hover {
      color: ${hoverColor};
      ${hoverBackground ? "background-color : " + hoverBackground : ""};
    }

    :active {
      color: ${activeColor};
    }
  `;

  return (
    <StyledSpan onClick={click}>{children}</StyledSpan>
  );
};

export const HamburgerMenu = ({ closed, click }) => {
  const [show, setShow] = useState(closed);

  const StyledButton = styled.button`
    /* inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 */

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 0.375rem;
    color: grey;

    &:hover {
    }
  `;

  const StyledDiv = styled.div`
    margin-left: 2rem;
    display: flex;
    align-items: center;

    @media only screen and (min-width: ${LG}) {
      display: none;
    }
  `;

  const CloseButton = styled.span`
    height: 1.5rem;
    width: 1.5rem;
    display: ${show ? "none" : "block"};
  `;

  const XButton = styled.span`
    height: 1.5rem;
    width: 1.5rem;
    display: ${show ? "block" : "none"};
  `;

  const clickCallback = () => {
    if (click) click();
    setShow((s) => !s);
  };

  return (
    <StyledDiv>
      <StyledButton
        onClick={clickCallback}
        type="button"
        aria-controls="mobile-menu"
        aria-expanded="false"
      >
        {/* <span class="sr-only">Open main menu</span> */}
        {/* <!--
            Icon when menu is closed.

            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          --> */}
        <CloseButton>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </CloseButton>
        {/* <!--
            Icon when menu is open.

            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          --> */}
        <XButton>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </XButton>
      </StyledButton>
    </StyledDiv>
  );
};
