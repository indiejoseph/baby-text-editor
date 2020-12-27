import { Textarea } from '@rebass/forms';
import emoji from 'emoji-dictionary';
import { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
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

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const StyledTextarea = styled(Textarea)`
  && {
    display: block;
    position: absolute;
    margin: 0;
    border: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    border-radius: 0;
    font-family: 'Nunito', sans-serif;
    font-weight: 900;
    overflow: auto;
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
  overflow: auto;
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

  mark {
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
  const [value, setValue] = React.useState<string>('Hello World');
  const [text, setText] = React.useState<string>('Hello World');
  const [fontSize, setFontSize] = React.useState<string>('3em');
  const textareaRef = React.useRef<HTMLTextAreaElement>();
  const backdropRef = React.useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const defaultFontSize = 24;

  function getFontSize() {
    const w =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const size = Math.min(10, Math.max(1, w / defaultFontSize / 4));

    return size;
  }

  function speak(chars: string) {
    if (chars) {
      const utterance = new SpeechSynthesisUtterance(chars.toLowerCase());
      const voices = window.speechSynthesis.getVoices();

      // eslint-disable-next-line prefer-destructuring
      utterance.voice = voices[48];

      speechSynthesis.speak(utterance);
    }
  }

  function handleResize() {
    const newFontSize = getFontSize();

    setFontSize(`${newFontSize}em`);
  }

  function applyHighlights(txt: string) {
    return txt.replace(/\n$/g, '\n\n').replace(/.{1}/g, '<mark>$&</mark>');
  }

  const handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = event => {
    const { data } = event.nativeEvent as any;
    let rawText = event.currentTarget.value;

    // speak the work if detected space otherwise speak the character only
    if (data !== ' ') {
      speak(data);
    } else {
      const lastWordMatchArray = /(:?\w+)\s$/.exec(rawText);
      let word = '';

      // check is it emoji(with colon prefix)
      if (lastWordMatchArray) {
        [, word] = lastWordMatchArray;

        if (/^:/.test(word)) {
          const normalizedWord = word.replace(/^:/, '');

          console.log(word2Shapes.has(normalizedWord));

          if (word2Shapes.has(normalizedWord)) {
            console.log(word2Shapes.has(normalizedWord));

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            rawText = rawText.replace(new RegExp(`${word} $`), word2Shapes.get(normalizedWord)!);
            word = word.replace(/(-|_|:)/g, ' '); // remove non word characters for better tts
          } else {
            // prefix colon for emoji
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

    handleResize();
    setText(applyHighlights(textareaValue));
  }, [setText]);

  // Window resize listener
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setFontSize]);

  // Monitor text change
  React.useEffect(() => {
    handleResize();
  }, [value]);

  return (
    <Container>
      <Backdrop ref={backdropRef}>
        <Highlights
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
