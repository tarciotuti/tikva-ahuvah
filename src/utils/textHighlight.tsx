import React from 'react';
import { Text, TextStyle } from 'react-native';

/**
 * Renderiza o texto do versículo destacando a palavra "Esperança" / "esperança"
 * em negrito com cor verde diferenciada.
 */
export function renderVerseWithHopeHighlight(
  text: string,
  defaultStyle?: TextStyle,
  highlightStyle?: TextStyle
) {
  const regex = /(\b[Ee]sperança[s]?\b)/gi;
  const parts = text.split(regex);

  return (
    <Text style={defaultStyle}>
      {parts.map((part, index) => {
        if (part.toLowerCase().startsWith('esperança')) {
          return (
            <Text
              key={index}
              style={[
                {
                  fontWeight: '900',
                  color: '#27AE60', // Verde vibrante
                },
                highlightStyle,
              ]}
            >
              {part}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
}
