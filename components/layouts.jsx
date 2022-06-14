import React, { useEffect, useState } from "react";
import Image from "next/image";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { LG, SM } from "./breakpoints";
import { BLACK, LIGHT_GREY, RICH_BLACK, WHITE } from "./colors";
import { Container, Flexbox, PaddedContent } from "./containers";
import { Button, HamburgerMenu, LinkButton } from "./buttons";
import smallLogo from "../public/anime-bay-600.svg";
import mediumLogo from "../public/anime-bay-800.svg";
import { IconInput } from "./inputs";
import Head from "next/head";

const srOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
  visibility: hidden;
`;

const darkCss = css`
  background-color: ${RICH_BLACK};
  color: ${WHITE};
`;

const lightCss = css`
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
`;

const LgElement100 = styled.div`
  display: none;
  width: 100%;
  @media only screen and (min-width: ${LG}) {
    display: block;
  }
`;

const SmElement100 = styled.div`
  display: block;
  width: 100%;
  @media only screen and (min-width: ${LG}) {
    display: none;
  }
`;

export const LgElement = styled.div`
  display: none;
  @media only screen and (min-width: ${LG}) {
    display: block;
  }
`;

export const SmElement = styled.div`
  display: block;
  @media only screen and (min-width: ${LG}) {
    display: none;
  }
`;

export const Navbar = ({
  links = [
    {
      href: "/",
      text: "Anime",
    },
    {
      href: "/collections",
      text: "Your Collection",
    },
  ],
  darkMode = false,
}) => {
  const [open, setOpen] = useState(false);

  const StyledNavbar = styled.nav`
    z-index: 50;
    background-color: ${WHITE};

    ${darkMode ? darkCss : lightCss};
  `;

  const openMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <StyledNavbar>
        <PaddedContent backgroundColor={darkMode ? RICH_BLACK : WHITE}>
          <Flexbox
            css={css`
              flex: 1 1 0;
            `}
            justify="space-between"
            minHeight="4rem"
          >
            {/* Navigations */}
            <Flexbox>
              <SmElement>
                <Image
                  src={smallLogo}
                  alt="Small Logo"
                  width={40}
                  height={48}
                />
              </SmElement>
              <LgElement>
                <Image
                  src={mediumLogo}
                  alt="Large Logo"
                  width={160}
                  height={60}
                />
              </LgElement>

              {/* Navigations */}
              <LgElement>
                <Flexbox
                  css={css`
                    margin-left: 1.25rem;

                    & > * {
                      margin-left: 2rem;
                    }
                  `}
                >
                  {links.map((link) => (
                    <LinkButton
                      key={link.text}
                      href={link.href}
                      textColor={"grey"}
                      hoverColor={BLACK}
                    >
                      {link.text}
                    </LinkButton>
                  ))}
                </Flexbox>
              </LgElement>
            </Flexbox>

            {/* Search Bar */}
            {/* <Flexbox
              shrink={0}
              grow={0}
              justify="center"
              css={css`
                padding: 0.5rem 0;

                @media only screen and (min-width: ${LG}) {
                  margin-left: 1.5rem;
                  justify-content: end;
                }
              `}
            >
              <IconInput></IconInput>
            </Flexbox> */}

            {/* Hamburger Menu */}
            <SmElement>
              <HamburgerMenu click={openMenu} closed={open}></HamburgerMenu>
            </SmElement>
          </Flexbox>

          <MobileNavbar menuOpened={!open} links={links} />
        </PaddedContent>
      </StyledNavbar>
    </>
  );
};

export const MobileNavbar = ({ links, menuOpened }) => {
  return (
    <SmElement>
      <div hidden={menuOpened}>
        {/* <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" --> */}
        <Flexbox
          direction="column"
          css={css`
            padding-top: 0.5rem;
            padding-bottom: 0.75rem;

            & > * {
              margin: 0.25rem 0rem;
            }
          `}
        >
          {links.map((link) => (
            <LinkButton
              key={link.text}
              href={link.href}
              textColor={"#808080"}
              hoverColor={WHITE}
              hoverBackground={BLACK}
              width={"100%"}
              fontSize="1.25rem"
            >
              {link.text}
            </LinkButton>
          ))}
        </Flexbox>
      </div>
    </SmElement>
  );
};

export const Footer = ({ darkMode = false }) => {
  const StyledFooter = styled.footer`
    margin: 0 auto;
    border-top: 1px ${LIGHT_GREY} solid;
    background-color: ${WHITE};
    max-width: 95%;

    /* ${darkMode ? darkCss : lightCss}; */
  `;

  const StyledDiv = styled.div`
    text-align: center;
    color: ${RICH_BLACK};
    padding: 2rem 0;
    font-size: small;
    color: grey;

    @media only screen and (min-width: ${SM}) {
      font-size: larger;
    }
  `;

  return (
    <StyledFooter>
      <StyledDiv>&copy; 2022 Anime Bay, Corp. All rights reserved.</StyledDiv>
    </StyledFooter>
  );
};

export const Pagination = ({
  pages = 10,
  hasNext,
  currPage,
  prevAction,
  nextAction,
  goToPageAction,
  perPage,
  total,
}) => {
  const noRounded = css`
    border-radius: 0;
    min-width: 2.5rem;
    transition: none;
    font-weight: bold;
    border-left: none;
    cursor: pointer;
  `;

  const bigButton = css`
    font-size: large;
    font-weight: bold;
    padding: 0.5rem;
  `;

  const [pageArray, setPageArray] = useState([]);

  if (pages > 9) {
    if (currPage + 2 <= pages - 3) {
      pageArray.push(currPage);
      pageArray.push(currPage + 1);
      pageArray.push(currPage + 2);
      pageArray.push("...");
    } else {
      pageArray.push(1);
      pageArray.push("...");
      pageArray.push(pages - 4);
      pageArray.push(pages - 3);
    }

    pageArray.push(pages - 2);
    pageArray.push(pages - 1);
    pageArray.push(pages);
  } else {
    for (let index = 0; index < pages; index++) {
      pageArray.push(index);
    }
  }

  return (
    <Flexbox
      css={css`
        background-color: ${WHITE};
        padding: 0.75rem 1rem;
        width: 100%;

        @media only screen and (min-width: ${SM}) {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
      `}
    >
      <SmElement100>
        <Flexbox shrink={1} grow={1} justify="space-evenly">
          <Button css={bigButton} click={prevAction} disabled={currPage === 1}>
            Prev
          </Button>
          <Button css={bigButton} click={nextAction} disabled={!hasNext}>
            Next
          </Button>
        </Flexbox>
      </SmElement100>

      <LgElement100>
        <Flexbox justify="space-between" grow={1} shrink={1}>
          <div>
            <p>
              Showing {(currPage - 1) * perPage + 1} to {total} of results
            </p>
          </div>

          <div>
            <Button
              click={prevAction}
              css={css`
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                font-weight: bolder;
              `}
              disabled={currPage === 1}
            >
              {"<"}
            </Button>
            {pageArray.map((buttonPage, key) => {
              return buttonPage === "..." ? (
                <Button key={key} disabled={true} css={noRounded}>
                  {buttonPage}
                </Button>
              ) : (
                <Button
                  key={key}
                  click={() => goToPageAction(buttonPage)}
                  css={noRounded}
                  isActive={currPage === buttonPage}
                >
                  {buttonPage}
                </Button>
              );
            })}
            <Button
              click={nextAction}
              css={css`
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border-left: none;
                font-weight: bolder;

                :hover {
                  border-left: none;
                }
              `}
              disabled={!hasNext}
            >
              {">"}
            </Button>
          </div>
        </Flexbox>
      </LgElement100>
    </Flexbox>
  );
};

export const Layout = ({ children, title="Anime Bay" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/anime-bay-600.svg" />
      </Head>
      <Navbar />
      <PaddedContent verticalMargin="2rem">
        {children}
      </PaddedContent>
      <Footer />
    </>
  );
};

export const Breadcrumb = ({ links }) => {
  return (
    <Flexbox
      css={css`
        margin-top: 1rem;
        margin-bottom: 0;
        z-index: 1;
        position: relative;
        display: block;

        @media only screen and (min-width: ${LG}) {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}
      minHeight={"1rem"}
    >
      <Flexbox
        shrink={1}
        grow={1}
        css={css`
          min-width: 0;
        `}
      >
        <nav>
          <Flexbox minHeight="1rem">
            <div>
              <Flexbox
                alignment="center"
                css={css`
                  & > * {
                    margin: 1rem 0;
                  }
                `}
                minHeight="1rem"
              >
                {links.map((link, index) =>
                  index === 0 ? (
                    <div key={index}>
                      <div>
                        <LinkButton href={link.href} textColor={RICH_BLACK}>
                          {link.name}
                        </LinkButton>
                      </div>
                    </div>
                  ) : (
                    <div key={index}>
                      <Flexbox>
                        <Container
                          css={css`
                            width: 1rem;
                            height: 1rem;
                          `}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Container>
                        <div>
                          <LinkButton href={link.href} textColor={RICH_BLACK}>
                            {link.name}
                          </LinkButton>
                        </div>
                      </Flexbox>
                    </div>
                  )
                )}
              </Flexbox>
            </div>
          </Flexbox>
        </nav>
      </Flexbox>
    </Flexbox>
  );
};
