import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, TextInput, TouchableOpacity, View } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TaskPriority } from '../../enums/priority';
import { localization } from '../../localization';
import { AppText } from '../AppText';
import { styles } from './styles';

interface AppCardProps {
  name: string;
  date: string;
  priority: TaskPriority;
  scrollY: Animated.Value;
  index: number;
  onUpdateTask?: (updatedName: string) => void;
  onRemoveTask?: () => void;
  onClick?: () => void;
}

interface PriorityValue {
  color: string;
  text: string;
}

const AppCard: React.FC<AppCardProps> = ({
  name = 'Task Id',
  date = 'date number',
  priority = TaskPriority.MEDIUM,
  scrollY,
  index = 0,
  onUpdateTask,
  onRemoveTask,
  onClick,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>(name);
  const [isChecked, setChecked] = useState<boolean>(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedOpacityCollapsed = useRef(new Animated.Value(1)).current;
  const titleSlideDown = useRef(new Animated.Value(0)).current;
  const heightAnimation = useRef(new Animated.Value(100)).current;

  const priorityValue = useMemo((): PriorityValue => {
    switch (priority) {
      case TaskPriority.HIGH:
        return {
          color: '#FF6B6B',
          text: localization['task']?.priority?.high || 'High',
        };
      case TaskPriority.MEDIUM:
        return {
          color: '#FFD166',
          text: localization['task']?.priority?.medium || 'Medium',
        };
      case TaskPriority.LOW:
        return {
          color: '#06D6A0',
          text: localization['task']?.priority?.low || 'Low',
        };
      default:
        return {
          color: '#CCC',
          text: localization['task']?.priority?.medium || 'Medium',
        };
    }
  }, [priority]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setTaskName(name || '');
  }, [name]);

  const toggleExpand = (): void => {
    if (onClick) onClick();

    const newExpanded = !expanded;
    setExpanded(newExpanded);

    titleSlideDown.stopAnimation();
    animatedOpacity.stopAnimation();
    animatedOpacityCollapsed.stopAnimation();
    heightAnimation.stopAnimation();

    if (newExpanded) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(titleSlideDown, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(animatedOpacityCollapsed, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(heightAnimation, {
            toValue: 350,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      titleSlideDown.setValue(0);

      Animated.parallel([
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),

        Animated.timing(heightAnimation, {
          toValue: 100,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        Animated.timing(animatedOpacityCollapsed, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const safeScrollY = scrollY || new Animated.Value(0);

  const translateY = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });

  const rotate = safeScrollY.interpolate({
    inputRange: [-100, 0, 200 * index, 200 * (index + 5)],
    outputRange: ['0deg', '0deg', '0deg', '-2deg'],
    extrapolate: 'clamp',
  });

  const scale = safeScrollY.interpolate({
    inputRange: [-100, 0, 200 * index, 200 * (index + 5)],
    outputRange: [1, 1, 1, 0.9],
    extrapolate: 'clamp',
  });

  const translateX = safeScrollY.interpolate({
    inputRange: [-100, 0, 200 * index, 200 * (index + 5)],
    outputRange: [0, 0, 0, index % 2 === 0 ? -5 : 5],
    extrapolate: 'clamp',
  });

  const handleRemoveTask = (): void => {
    if (onRemoveTask) {
      onRemoveTask();
    }
  };

  const handleSubmit = (): void => {
    if (onUpdateTask && taskName !== name && taskName.trim() !== '') {
      onUpdateTask(taskName);
    }
    toggleExpand();
  };

  return (
    <Animated.View
      style={[
        {
          opacity,
          transform: [{ translateY }, { scale }, { translateX }, { rotate }],
        },
      ]}
    >
      <Animated.View style={[styles.container, { height: heightAnimation }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={toggleExpand} activeOpacity={0.8}>
          {expanded && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRemoveTask}
              style={styles.btnRemove}
            >
              <Ionicons name='trash' size={18} />
              <AppText.Paragraph
                text={localization['task']?.remove || 'Remove'}
                style={{ fontSize: 14 }}
              />
            </TouchableOpacity>
          )}

          <Animated.View
            style={{
              opacity: animatedOpacityCollapsed,
              transform: [
                {
                  translateY: titleSlideDown.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, 20, 40],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}
          >
            {!expanded && (
              <View style={styles.collapsedContainer}>
                <Fontisto
                  name={isChecked ? 'checkbox-active' : 'checkbox-passive'}
                  size={18}
                  onPress={() => setChecked(!isChecked)}
                />
                <View style={styles.infoCollapsedContainer}>
                  <View style={styles.infoRowCollapsed}>
                    <AppText.Paragraph text={name || ''} style={styles.txtTitle} />
                    <Ionicons name='pencil' size={14} />
                  </View>
                  <View style={styles.infoRowCollapsed}>
                    <AppText.Paragraph
                      text={priorityValue.text}
                      style={{ color: priorityValue.color }}
                    />
                  </View>
                </View>
              </View>
            )}
          </Animated.View>

          {expanded && (
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  opacity: animatedOpacity,
                  transform: [
                    {
                      translateY: animatedOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}
            >
              <TextInput
                value={taskName}
                onChangeText={setTaskName}
                style={styles.txtInput}
                autoFocus={true}
                returnKeyType='done'
                onSubmitEditing={handleSubmit}
              />
            </Animated.View>
          )}

          <Animated.View
            style={{
              opacity: animatedOpacity,
              gap: 16,
              overflow: 'hidden',
            }}
          >
            <View style={styles.infoRow}>
              <AppText.Paragraph
                text={localization['task']?.date || 'Date'}
                style={styles.txtTitle}
              />
              <AppText.Paragraph text={date || ''} />
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <AppText.Paragraph
                text={localization['task']?.priority?.label || 'Priority'}
                style={styles.txtTitle}
              />
              <AppText.Paragraph text={priorityValue.text} style={{ color: priorityValue.color }} />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.btnSubmit} activeOpacity={0.8} onPress={handleSubmit}>
              <AppText.Paragraph
                text={localization['task']?.submit || 'Submit'}
                style={styles.txtButtonSubmit}
              />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default React.memo(AppCard);
