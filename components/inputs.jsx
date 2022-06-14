/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { LG, SM } from "./breakpoints";
import { BLACK, ERROR_RED, FRENCH_BLUE, GRE, GREY, GREYY } from "./colors";

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
    color: "#808080",
    height,
    width,
  }));

  const AbsoluteDiv = styled.div(({}) => ({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    left: "0px",
    top: "0px",
    bottom: "0px",
    paddingLeft: "0.75rem",
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
        <Input
          id={"search"}
          name="search"
          placeholder={"Search"}
          type="search"
        ></Input>
      </RelativeDiv>
    </StyledDiv>
  );
};

export const Input = ({ id, name, placeholder, type }) => {
  const StyledInput = styled.input`
    display: block;

    padding-left: 2.5rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border: 1px solid #cfcece;
    border-radius: 0.375rem;

    &:focus {
      border: 1px solid ${FRENCH_BLUE};
    }
  `;

  return (
    <StyledInput id={id} name={name} placeholder={placeholder} type={type} />
  );
};

export const InputWithError = ({
  label = "Email",
  type = "text",
  placeholder = "A placeholder..",
  hasError = true,
  hasLabel = false,
  error = "Placeholder Error!",
  reference
}) => {
  const [text, setText] = useState('');

  const handleChange = e => {
    reference.current = e.target.value;
    setText(e.target.value);
  }

  return (
    <div
      css={css`
        text-align: left;
      `}
    >
      {hasLabel ? <label htmlFor={label}>{label}</label> : ""}
      <div
        css={css`
          margin-top: 0.25rem;
          position: relative;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        `}
      >
        <input
          type={type}
          name={label}
          id={label}
          placeholder={placeholder}
          aria-invalid="true"
          aria-describedby="email-error"
          css={css`
            display: block;
            width: 100%;
            padding: 0.5rem ${hasError ? '2.5rem' : '0.25rem'} 0.5rem 0.25rem;
            border: 1px ${hasError ? ERROR_RED : GREY} solid;
            color: ${hasError ? ERROR_RED : BLACK};
            border-radius: 0.25rem;

            &:focus {
              outline: 2px solid transparent;
              outline-offset: 2px;
              border: 1.5px ${hasError ? ERROR_RED : FRENCH_BLUE} solid;
            }

            @media only screen and (min-width: ${SM}) {
              font-size: 0.875rem;
              line-height: 1.25rem;
            }
          `}
          value={text}
          onChange={handleChange}
        />
        <div
          css={css`
            position: absolute;
            top: 0px;
            bottom: 0px;
            right: 0px;
            padding-right: 0.75rem;
            display: ${hasError ? "flex" : "none"};
            align-items: center;
            pointer-events: none;
          `}
        >
          <svg
            css={css`
              height: 1.25rem;
              width: 1.25rem;
              color: ${ERROR_RED};
            `}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <p
        css={css`
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: ${ERROR_RED};
          display: ${hasError ? "flex" : "none"};
        `}
        id="email-error"
      >
        {error}
      </p>
    </div>
  );
};
