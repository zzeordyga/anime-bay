/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { createCollection, putItems, removeItem } from "../lib/storage";
import { LG, MD, SM } from "./breakpoints";
import { Button } from "./buttons";
import { LIGHT_GREY } from "./colors";
import { Card, PaddedContent, ScrollableContainer } from "./containers";
import { InputWithError } from "./inputs";

export const InputModal = ({
  title,
  inputName,
  inputType,
  click,
  placeholder,
  show = true,
}) => {
    const value = useRef("");
    const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(show);

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
                font-size: larger;
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
              hasError={hasError}
              error={"Name cannot have any special characters and must be unique!"}
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
                  if(result.success){
                    setHasError(false);
                    setOpen(false);
                  }
                  else{
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
        </Card>
      </Modal>
    </>
  );
};

export const ContainerModal = ({
  children,
  show = true,
  modalWidth = "30",
}) => {
  const [open, setOpen] = useState(show);

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

export const CollectionModal = ({ item, tempCollections, show }) => {
  const value = useRef("");
  const [open, setOpen] = useState(show);
  const [hasError, setHasError] = useState(false);
  const [collections, setCollections] = useState(tempCollections);
  const itemsRef = useRef([]);

  const checkCollectionInArray = (collection) => {
    const result = collection.array.filter(data => data.id !== item.id);

    return result.length != 0;
  }

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, collections.length);
  }, [collections]);

  return (
    <ContainerModal modalWidth={25} show={open}>
      <Card>
        <div
          css={css`
            padding: 0.25rem 0;
            text-align: left;
          `}
        >
          <div
            css={css`
              border-bottom: 1px solid ${LIGHT_GREY};
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
              <label
                htmlFor={key}
                key={key}
                css={css`
                  background-color: white;
                  display: flex;
                  align-items: center;
                  cursor: pointer;

                  &:hover {
                    filter: brightness(95%);
                  }
                `}
                onClick={() => {
                  let event = new Event("change", { bubbles: true });
                  itemsRef.current[key].dispatchEvent(event);
                }}
              >
                <input
                  type="checkbox"
                  name={key}
                  id={key}
                  checked={checkCollectionInArray(collection)}
                  css={css`
                    border-radius: 0.25rem;
                    height: 1rem;
                    width: 1rem;
                    margin-right: 1rem;
                  `}
                  ref={(el) => (itemsRef.current[key] = el)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      putItems(collection.name, item);
                    } else {
                      removeItem(collection.name, item);
                    }
                  }}
                />
                {collection.name}
              </label>
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
              error={"Name cannot have any special characters and must be unique!"}
              reference={value}
            />

            <div
              css={css`
                margin-top: 1rem;
              `}
            >
              <Button
                click={() => {
                  const result = item ? createCollection(value.current, item) : createCollection(value.current);
                  if(result.success){
                    setCollections(c => [...c, {name : value.current, array : result.result}])
                    setHasError(false);
                    setOpen(false);
                  }
                  else{
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
