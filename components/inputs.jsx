import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { LG } from "./breakpoints";
import { FRENCH_BLUE, LIGHT_GREY } from "./colors";

export const IconInput = () => {
  const StyledDiv = styled.div`
    max-width: 32rem;
    width: 100%;

    @media only screen and (min-width: ${LG}) {
      max-width: 20rem;
    }
  `;

  const RelativeDiv = styled.div`
    position: relative;
  `;

  const IconSpan = styled.span(({ height = "1.25rem", width = "1.25rem" }) => ({
    color: '#808080',
    height,
    width,
  }));

  const AbsoluteDiv = styled.div(({}) => ({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    left: '0px',
    top: '0px',
    bottom:'0px',
    paddingLeft : '0.75rem'
  }));

  return (
    <StyledDiv>
      <RelativeDiv>
        <AbsoluteDiv>
          <IconSpan>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </IconSpan>
        </AbsoluteDiv>
        <Input id={'search'} name='search' placeholder={'Search'} type="search"></Input>
      </RelativeDiv>
    </StyledDiv>
  );
};

export const Input = ({id, name, placeholder, type}) => {
  
    const StyledInput = styled.input`
      display : block;
      
      padding-left: 2.5rem;
      padding-right: 0.75rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      border: 1px solid #cfcece;
      border-radius: 0.375rem;
      
      &:focus{
        border: 1px solid ${FRENCH_BLUE};
      }
    `;

  return <StyledInput id={id} name={name} placeholder={placeholder} type={type}/>;
};
