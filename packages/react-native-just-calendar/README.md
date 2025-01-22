# @bertsky/react-native-just-calendar 📅

A lightweight and customizable calendar component for React Native.

### Benefits ✨

- **Pure JavaScript:** No native code dependencies, making it easy to integrate and compatible with any React Native environment.
- **Optimized for Performance:** Smooth month scrolling and efficient handling of markings.
- **Customizable Markings:** Easily add, update, and remove day markings for events, appointments, or highlights.

---

## Installation 🚀

To install the package, use npm or yarn:

```bash
npm install @bertsky/react-native-just-calendar
```

or

```bash
yarn add @bertsky/react-native-just-calendar
```

---

## Usage 📖

Here's an example of how to use the `Calendar` component:

```tsx
import { View } from 'react-native';
import { Calendar, Markings } from '@bertsky/react-native-just-calendar';
import { useCallback, useState } from 'react';
import { deleteAt } from 'fp-ts/Record';
import i18n from './i18n'; // Your i18n configuration file

export default function App() {
  const [markings, setMarkings] = useState<Markings>({});

  const onDayPress = useCallback((key: string) => {
    setMarkings(
      (prev) =>
        prev[key]
          ? deleteAt(key)(prev) // Remove the marking if it already exists
          : { ...prev, [key]: { color: 'green' } }, // Add a new marking
    );
  }, []);

  return (
    <View>
      <Calendar onDayPress={onDayPress} markings={markings} i18n={i18n} />
    </View>
  );
}
```

### Props ⚙️

- **`onDayPress`**: `(key: string) => void`  
  Callback triggered when a day is pressed. Use it to handle marking or unmarking days.

- **`markings`**: `Markings`  
  An object defining the markings for each day. Keys are day strings (e.g., "2024-12-21"), and values define the marking style (e.g., `{ color: "green" }`).

- **`i18n`**: `object`  
  An object to customize calendar localization, such as month names, day names, or any other text.

---

## Features 🌟

- **Smooth Month Navigation:** Easily scroll between months with a swipe gesture.
- **Customizable Styles:** Personalize the calendar appearance to fit your app's theme.
- **Localization Support:** Pass your custom i18n configuration for multi-language support.

---

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/bertsky/react-native-just-calendar).

---

## License 📝

MIT
