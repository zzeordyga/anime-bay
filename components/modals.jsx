/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import {
  createCollection,
  getAllCollection,
  putItems,
  removeItem,
} from "../lib/storage";
import { LG, MD, SM } from "./breakpoints";
import { Button } from "./buttons";
import {
  ERROR_RED,
  GREY,
  LIGHT_GREY,
  RICH_BLACK,
  VIVID_CERULEAN,
  WHITE,
} from "./colors";
import { Card, PaddedContent, ScrollableContainer } from "./containers";
import { InputWithError } from "./inputs";
import dynamic from "next/dynamic";

const CheckboxContainer = dynamic(() => import("./containers"));

export const InputModal = ({
  title,
  inputName,
  inputType,
  click,
  placeholder,
  open = true,
  setOpen,
  error = false,
  promptMessage = "Submit",
}) => {
  const value = useRef("");
  const [hasError, setHasError] = useState(error);

  const Overlay = styled.div`
    min-height: 100%;
    min-width: 100%;
    background-color: #00000075;
    z-index: 100;
    position: fixed;

    ${!open ? `display : none;` : ""};

    transition: all 0.5s ease-in;
  `;

  const Modal = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    min-width: 80%;

    @media only screen and (min-width: ${SM}) {
      min-width: 30%;
    }

    ${!open ? `display : none;` : ""};
  `;

  return (
    <>
      <Overlay onClick={() => setOpen((open) => !open)} />
      <Modal>
        <Card borderRadius="3rem">
          <PaddedContent
            verticalPadding={"1rem"}
            css={css`
              border-radius: 2rem;
            `}
          >
            <div
              css={css`
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 1rem;
              `}
            >
              {title}
            </div>
            <InputWithError
              label={inputName}
              type={inputType}
              hasLabel={false}
              placeholder={placeholder}
              hasError={false}
              error={
                "Name cannot have any special characters and must be unique!"
              }
              reference={value}
            />

            <div
              css={css`
                margin-top: 1rem;
              `}
            >
              <Button
                click={() => {
                  const result = click(value.current);
                  if (result && result.success) {
                    setHasError(false);
                    setOpen(false);
                  } else {
                    setHasError(true);
                  }
                }}
              >
                <span
                  css={css`
                    font-weight: 600;
                  `}
                >
                  {promptMessage}
                </span>
              </Button>
            </div>
          </PaddedContent>
        </Card>
      </Modal>
    </>
  );
};

export const ContainerModal = ({
  children,
  open = true,
  setOpen,
  modalWidth = "30",
}) => {
  const Overlay = styled.div`
    min-height: 100%;
    min-width: 100%;
    background-color: #00000075;
    z-index: 100;
    position: fixed;

    ${!open ? `display : none;` : ""};

    transition: all 0.5s ease-in;
  `;

  const Modal = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    min-width: 80%;

    @media only screen and (min-width: ${SM}) {
      min-width: ${modalWidth * 2 + "%"};
    }

    @media only screen and (min-width: ${LG}) {
      min-width: ${modalWidth + "%"};
    }

    ${!open ? `display : none;` : ""};
  `;

  return (
    <>
      <Overlay onClick={() => setOpen((o) => !o)}></Overlay>
      <Modal>{children}</Modal>
    </>
  );
};

export const PromptModal = ({
  action,
  title,
  description = "",
  open,
  setOpen,
  prompt = "Confirm",
}) => {
  return (
    <ContainerModal modalWidth={25} open={open} setOpen={setOpen}>
      <Card>
        <div
          css={css`
            padding: 0.25rem 0;
            text-align: center;
          `}
        >
          <PaddedContent
            verticalPadding={"1rem"}
            css={css`
              border-radius: 2rem;
            `}
          >
            <div
              css={css`
                font-size: 2.5rem;
                font-weight: bold;
              `}
            >
              {title}
            </div>

            <div
              css={css`
                font-size: 1rem;
                margin: 1rem 0;
                color: rgb(107 114 128); ;
              `}
            >
              {description}
            </div>

            <div
              css={css`
                & > * {
                  margin-left: 1rem;
                }
              `}
            >
              <Button
                textColor={WHITE}
                hoverText={ERROR_RED}
                backgroundColor={ERROR_RED}
                borderColor={ERROR_RED}
                click={() => {
                  action();
                  setOpen(false);
                }}
              >
                <span
                  css={css`
                    font-weight: 700;
                  `}
                >
                  {prompt}
                </span>
              </Button>
              <Button
                textColor={RICH_BLACK}
                hoverText={RICH_BLACK}
                backgroundColor={WHITE}
                hoverBackground={LIGHT_GREY}
                click={action}
              >
                <span
                  css={css`
                    border-color: ${VIVID_CERULEAN};
                    font-weight: 700;
                    border-width: 2px;
                  `}
                >
                  Cancel
                </span>
              </Button>
            </div>
          </PaddedContent>
        </div>
      </Card>
    </ContainerModal>
  );
};

export const CollectionModal = ({ item, open = false, setOpen, action }) => {
  const value = useRef("");
  const [hasError, setHasError] = useState(false);
  const [collections, setCollections] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const temp = getAllCollection();

    setCollections(temp);

    console.log("USE EFFECT");
  }, [flag]);

  const checkCollectionInArray = (collection) => {
    for (let index = 0; index < collection.length; index++) {
      const curr = collection[index];

      if (item.id === curr.id) return true;
    }

    return false;
  };

  const editCollection = (checked, name) => {
    console.log("Editing");
    let result;
    if (!checked) {
      result = putItems(name, item);
    } else {
      result = removeItem(name, item);
    }

    action();

    setFlag((flag) => !flag);
  };

  return (
    <ContainerModal modalWidth={25} open={open} setOpen={setOpen}>
      <Card>
        <div
          css={css`
            padding: 0.25rem 0;
            text-align: left;
          `}
        >
          <div
            css={css`
              border-bottom: 1px solid ${GREY};
            `}
          >
            <h3
              css={css`
                margin-left: 2rem;
              `}
            >
              Add to..
            </h3>
          </div>
          <ScrollableContainer>
            {collections.map((collection, key) => (
              <CheckboxContainer
                key={key}
                id={key}
                changeAction={editCollection}
                isChecked={checkCollectionInArray(collection.array)}
                name={collection.name}
              />
            ))}
          </ScrollableContainer>
          <PaddedContent
            verticalPadding={"1rem"}
            css={css`
              border-radius: 2rem;
            `}
          >
            <div
              css={css`
                padding-top: 1rem;
                border-top: 1px solid ${LIGHT_GREY};
                font-size: larger;
                font-weight: bold;
                margin-bottom: 1rem;
              `}
            >
              Create Collection
            </div>
            <InputWithError
              label={"collection"}
              placeholder={"Input your name here"}
              hasError={hasError}
              error={
                "Name cannot have any special characters and must be unique!"
              }
              reference={value}
            />

            <div
              css={css`
                margin-top: 1rem;
              `}
            >
              <Button
                click={() => {
                  const result = item
                    ? createCollection(value.current, item)
                    : createCollection(value.current);
                  if (result && result.success) {
                    setCollections((c) => [
                      ...c,
                      { name: value.current, array: result.result },
                    ]);
                    setHasError(false);
                  } else {
                    setHasError(true);
                  }
                }}
              >
                <span
                  css={css`
                    font-weight: 600;
                  `}
                >
                  Submit
                </span>
              </Button>
            </div>
          </PaddedContent>
        </div>
      </Card>
    </ContainerModal>
  );
};
