import { Linking, StyleSheet, TextStyle } from "react-native";
import Typography from "./ui/Typography";
import { extractUrls } from "@lib/utils";

const HyperlinkText = ({
  message,
  style,
}: {
  message: string;
  style: TextStyle;
}) => {
  const urls = extractUrls(message);

  if (urls) {
    const parts = message.split(/(https?:\/\/[^\s]+)/g);

    return (
      <Typography style={{ ...style }}>
        {parts.map((part, index) => {
          if (urls.includes(part)) {
            return (
              <Typography
                key={index}
                style={styles.link}
                onPress={() => Linking.openURL(part)}
              >
                {part}
              </Typography>
            );
          }
          return part;
        })}
      </Typography>
    );
  }

  return <Typography style={{ ...style }}>{message}</Typography>;
};

const styles = StyleSheet.create({
  link: { color: "blue", textDecorationLine: "underline" },
});

export default HyperlinkText;
