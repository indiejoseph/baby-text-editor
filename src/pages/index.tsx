import emoji from 'emoji-dictionary';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import { Textarea } from '../components/textarea';
import { useSetTimeout } from '../hooks/use-settimeout';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const IndexPage: NextPage = () => {
  const [value, setValue] = React.useState<string>('Hello Baby');
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

  const handleTextareaChange = (value: string) => {
    const lastWordMatchArray = /(:?\w+)\s$/.exec(value);
    let word = '';
    let newValue = value;

    // check is it emoji(with colon prefix)
    if (lastWordMatchArray) {
      [, word] = lastWordMatchArray;

      // detect prefix colon for emoji or shapes
      if (/^:/.test(word)) {
        const emojiChar: string = emoji.getUnicode(word);

        if (emojiChar) {
          newValue = value.replace(new RegExp(`${word} $`), emojiChar);
          word = word.replace(/(-|_|:)/g, ' '); // remove non word characters for better tts
        }
      }
    }

    if (word && word.length > 1) {
      speak(word);
    }

    setValue(newValue);
  };

  const handleTextareaClick = (value: string) => {
    speak(value);
  };

  // Initialize
  React.useEffect(() => {
    // trick to pre-load voices
    speak(' ');
  }, []);

  return (
    <Container>
      <Textarea value={value} onChange={handleTextareaChange} onClick={handleTextareaClick} />
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default IndexPage;
