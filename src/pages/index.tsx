import { Textarea } from '@rebass/forms';
import toHex from 'colornames';
import emoji from 'emoji-dictionary';
import { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import useFitText from 'use-fit-text';
import { colors } from '../styles';

const word2Shapes = new Map([
  ['triangle', '▲'],
  ['square', '■'],
  ['circle', '●'],
  ['parallelogram', '▰'],
  ['diamond', '◆'],
  ['oval', '⬬'],
  ['rectangle', '▮'],
  ['semi-circle', '◖'],
  ['heart', '♥'],
]);

const colornames = toHex
  .all()
  .filter(color => color.css)
  .map(color => color.name);

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const StyledTextarea = styled(Textarea)`
  && {
    position: absolute;
    margin: 0;
    border: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    border-radius: 0;
    font-family: 'Nunito', sans-serif;
    font-weight: 900;
    overflow: none;
    resize: none;
    color: white;
    outline: none;
    padding: 2rem;
    text-shadow: 0px 0px 0px transparent;
    -webkit-text-fill-color: transparent;
  }

  &::selection {
    background-color: ${colors.orange};
    color: white;
  }
`;

const Backdrop = styled.div`
  position: absolute;
  background-color: transparent;
  overflow: none;
  pointer-events: none;
  width: 100%;
  height: 100%;
  outline: none;
  padding: 2rem;
  z-index: 2;
`;

const Highlights = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: center;
  width: 100%;
  height: 100%;
  color: white;

  mark {
    transition: color 300ms linear;
    background-color: transparent;
    color: white;

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
  const [text, setText] = React.useState<string>('Hello Baby');
  const textareaRef = React.useRef<HTMLTextAreaElement>();
  const { fontSize, ref: highlightsRef } = useFitText({ maxFontSize: 1000, resolution: 2 });
  const backdropRef = React.useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  function speak(chars: string) {
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

      speechSynthesis.speak(utterance);
    }
  }

  function applyHighlights(txt: string) {
    let highlights = txt.replace(/\n$/g, '\n\n').replace(/(\w+|\d+|.)/g, '<mark>$&</mark>');
    const words = highlights.split(/<mark>([^<]+)<\/mark>/).filter(p => !!p && p !== ' ');

    words.forEach(word => {
      const color = toHex(word.toLowerCase());

      if (colornames.indexOf(word.toLowerCase()) === -1 || !color) {
        return;
      }

      highlights = highlights.replace(
        new RegExp(`<mark>${word}</mark>`),
        `<mark style="color: ${color}">${word}</mark>`
      );
    });

    return highlights;
  }

  const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = event => {
    let rawText = event.currentTarget.value;
    const lastWordMatchArray = /(:?\w+)\s$/.exec(rawText);
    let word = '';

    // check is it emoji(with colon prefix)
    if (lastWordMatchArray) {
      [, word] = lastWordMatchArray;

      // detect prefix colon for emoji or shapes
      if (/^:/.test(word)) {
        const normalizedWord = word.replace(/^:/, '');

        if (word2Shapes.has(normalizedWord)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          rawText = rawText.replace(new RegExp(`${word} $`), word2Shapes.get(normalizedWord)!);
          word = word.replace(/(-|_|:)/g, ' '); // remove non word characters for better tts
        } else {
          console.log(normalizedWord);

          const emojiChar: string = emoji.getUnicode(normalizedWord);

          if (emojiChar) {
            rawText = rawText.replace(new RegExp(`${word} $`), emojiChar);
            word = word.replace(/(-|_|:)/g, ' '); // remove non word characters for better tts
          }
        }
      }
    }

    if (word) {
      speak(word);
    }

    const highlights = applyHighlights(rawText);

    setValue(rawText);
    setText(highlights);
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
    const textareaValue = textareaRef.current ? textareaRef.current.value : '';

    setText(applyHighlights(textareaValue));
  }, [setText]);

  return (
    <Container>
      <Backdrop ref={backdropRef}>
        <Highlights
          ref={highlightsRef}
          dangerouslySetInnerHTML={{ __html: text }}
          style={{
            fontSize,
          }}
        />
      </Backdrop>
      <StyledTextarea
        ref={textareaRef}
        onChange={handleOnChange}
        onScroll={handleOnScroll}
        value={value}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        sx={{
          fontSize,
        }}
      />
    </Container>
  );
};

export default IndexPage;
