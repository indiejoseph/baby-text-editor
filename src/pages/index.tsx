import { Textarea } from '@rebass/forms';
import toHex from 'colornames';
import emoji from 'emoji-dictionary';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import { useSetTimeout } from '../hooks/use-settimeout';
import { colors } from '../styles';

const colornames = toHex
  .all()
  .filter(color => color.css)
  .map(color => color.name);

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const FONT_SIZE = '88px';

const StyledTextarea = styled(Textarea)`
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

    // hiding scroll bar
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
    text-shadow: none;
  }
`;

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

interface HighlightsProps {
  shadow?: boolean;
}

const Highlights = styled.div<HighlightsProps>`
  position: relative;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
  width: 100%;
  color: white;
  font-size: ${FONT_SIZE};
  overflow: auto;

  // hiding scroll bar
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }

  mark {
    transition: ${(props: HighlightsProps) =>
      (props as any).shadow ? 'none' : 'all 100ms ease-out'};
    background-color: transparent;
    color: white;
    opacity: 0;

    &.highlight {
      border-radius: 12px;
      background-color: rgba(255, 255, 255, 0.15);
    }

    &.ready {
      opacity: 1;
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

const IndexPage: NextPage = () => {
  const [value, setValue] = React.useState<string>('Hello Baby');
  const textareaRef = React.useRef<HTMLTextAreaElement>();
  const highlightsRef = React.useRef<HTMLDivElement>();
  const backdropRef = React.useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [timeout] = useSetTimeout();

  function speak(chars: string) {
    window.speechSynthesis.cancel();

    timeout(300).then(() => {
      if (chars) {
        const utterance = new SpeechSynthesisUtterance(chars.toLowerCase());
        const voices = window.speechSynthesis.getVoices();
        let voice = voices[0];
        const googleFemaleVoice = voices.find(({ name }) => name === 'Google US English'); // more natural
        const samanthaVoice = voices.find(({ name }) => name === 'Samantha'); // I like Samantha's voice

        if (googleFemaleVoice) {
          voice = googleFemaleVoice;
        } else if (samanthaVoice) {
          voice = samanthaVoice;
        }

        utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
      }
    });
  }

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

          return <mark key={i.toString()}>{word}</mark>;
        })}
      </>
    );
  }

  const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = async event => {
    let rawText = event.currentTarget.value;
    const char = (event.nativeEvent as any).data;
    const lastWordMatchArray = /(:?\w+)\s$/.exec(rawText);
    let word = '';

    if (char) {
      speak(char);
    }

    // check is it emoji(with colon prefix)
    if (lastWordMatchArray) {
      [, word] = lastWordMatchArray;

      // detect prefix colon for emoji or shapes
      if (/^:/.test(word)) {
        const emojiChar: string = emoji.getUnicode(word);

        if (emojiChar) {
          rawText = rawText.replace(new RegExp(`${word} $`), emojiChar);
          word = word.replace(/(-|_|:)/g, ' '); // remove non word characters for better tts
        }
      }
    }

    if (word && word.length > 1) {
      speak(word);
    }

    setValue(rawText);
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
      speak(clickedMark.innerHTML);
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

  // Initialize
  React.useEffect(() => {
    // trick to pre-load voices
    speak(' ');
  }, []);

  // Text changes
  React.useEffect(() => {
    // add class name to all mark in order to trigger transitions
    if (!highlightsRef || !highlightsRef.current) {
      return;
    }

    const marks = highlightsRef.current.querySelectorAll('mark');

    marks.forEach(mark => {
      if (!mark.classList.contains('ready')) {
        mark.classList.add('ready');
      }
    });
  }, [value]);

  return (
    <Container>
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
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default IndexPage;
