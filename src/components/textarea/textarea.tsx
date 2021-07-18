import { Textarea as RebassTextarea } from '@rebass/forms';
import toHex from 'colornames';
import Debug from 'debug';
import React, { FC } from 'react';
import styled from 'styled-components';
import { colors } from '../../styles';

const debug = Debug('web:textarea');

const FONT_SIZE = '88px';

const Backdrop = styled.div`
  position: absolute;
  background-color: transparent;
  overflow: auto;
  width: 100vw;
  height: 100vh;
  outline: none;
  padding: 2rem;
  z-index: 1;
`;

const Highlights = styled.div`
  position: relative;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
  width: 100%;
  color: white;
  font-size: ${FONT_SIZE};
  overflow: auto;

  /* hiding scroll bar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }

  mark {
    display: inline-block;
    background-color: transparent;
    color: white;
    box-sizing: border-box;

    &.highlight {
      border-radius: 12px;
      background-color: rgba(255, 255, 255, 0.07);
    }

    &:nth-child(10n + 1) {
      color: ${colors.orange};
    }

    &:nth-child(10n + 2) {
      color: ${colors.pink};
    }

    &:nth-child(10n + 3) {
      color: ${colors.red};
    }

    &:nth-child(10n + 4) {
      color: ${colors.yellow};
    }

    &:nth-child(10n + 5) {
      color: ${colors.green};
    }

    &:nth-child(10n + 6) {
      color: ${colors.blue};
    }

    &:nth-child(10n + 7) {
      color: ${colors.purple};
    }

    &:nth-child(10n + 8) {
      color: ${colors.brown};
    }

    &:nth-child(10n + 9) {
      color: ${colors.grey};
    }

    &:nth-child(10n + 10) {
      color: ${colors.beige};
    }
  }
`;

const colornames = toHex
  .all()
  .filter(color => color.css)
  .map(color => color.name);

function applyHighlights(txt: string) {
  const highlights = txt.replace(/\n$/g, '\n\n').split(/([-a-z0-9]+)/gi);

  return (
    <>
      {highlights.map((word, i) => {
        const color = toHex(word.toLowerCase());

        if (colornames.indexOf(word.toLowerCase()) !== -1 && color) {
          return (
            <mark style={{ color }} key={i.toString()}>
              {word}
            </mark>
          );
        }

        return <mark key={`${i}-${word}`}>{word}</mark>;
      })}
    </>
  );
}

const StyledTextarea = styled(RebassTextarea)`
  && {
    position: absolute;
    margin: 0;
    border: 0;
    width: 100%;
    height: 100%;
    text-align: left;
    border-radius: 0;
    font-family: 'Nunito', sans-serif;
    font-weight: 900;
    resize: none;
    font-size: ${FONT_SIZE};
    color: white;
    outline: none;
    padding: 2rem;
    text-shadow: 0px 0px 0px transparent;
    -webkit-text-fill-color: transparent;
    z-index: 2;

    /* hiding scroll bar */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      width: 0px;
      background: transparent; /* Chrome/Safari/Webkit */
    }
  }

  &::selection {
    background-color: ${colors.orange};
    color: white !important;
    -webkit-text-fill-color: white !important;
    text-shadow: none;
  }
`;

export interface TextareaProps
  extends Omit<React.HTMLProps<HTMLTextAreaElement>, 'onChange' | 'onClick' | 'value'> {
  value?: string;
  onChange?: (word: string) => void;
  onClick?: (word: string) => void;
}

export const Textarea: FC<TextareaProps> = ({ value = '', onClick, onChange }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>();
  const highlightsRef = React.useRef<HTMLDivElement>();
  const backdropRef = React.useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = async event => {
    let rawText = event.currentTarget.value;

    debug('onChange %s', rawText);

    onChange && onChange(rawText);
  };

  const handleOnClick: React.MouseEventHandler<HTMLTextAreaElement> = evt => {
    const elements = document.elementsFromPoint(evt.pageX, evt.pageY);
    const marks = (highlightsRef && highlightsRef.current
      ? highlightsRef.current.querySelectorAll('mark')
      : []) as NodeListOf<HTMLDivElement>;
    const clickedMark = elements.find(elm => elm.tagName === 'MARK');

    // remove class name `highlight` from all <mark/>
    marks.forEach(mark => {
      mark.classList.remove('highlight');
    });

    if (clickedMark) {
      onClick && onClick(clickedMark.innerHTML);
      clickedMark.classList.add('highlight');
    }
  };

  const handleOnScroll: React.WheelEventHandler<HTMLTextAreaElement> = () => {
    if (!textareaRef.current || !backdropRef.current) {
      return;
    }

    const { scrollTop } = textareaRef.current;
    const { scrollLeft } = textareaRef.current;

    backdropRef.current.scrollTop = scrollTop;
    backdropRef.current.scrollLeft = scrollLeft;
  };

  return (
    <>
      <Backdrop ref={backdropRef}>
        <Highlights ref={highlightsRef as React.RefObject<HTMLDivElement>}>
          {applyHighlights(value)}
        </Highlights>
      </Backdrop>
      <StyledTextarea
        ref={textareaRef}
        onChange={handleOnChange}
        onScroll={handleOnScroll}
        onClick={handleOnClick}
        value={value}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </>
  );
};
