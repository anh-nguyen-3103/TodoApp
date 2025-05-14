import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TaskPriority } from '../../enums/priority';
import { localization } from '../../localization';
import { Task } from '../../models/task';

import { AppText } from '../AppText';
import { styles } from './styles';

interface AppCardProps {
  item: Task;
  scrollY: Animated.SharedValue<number>;
  index: number;
  onUpdateTask?: (updatedName: string) => void;
  onRemoveTask?: () => void;
  onClick?: () => void;
}

interface PriorityValue {
  color: string;
  text: string;
}

const ANIMATION_CONFIG = {
  duration: 500,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

const AppCard: React.FC<AppCardProps> = memo(
  ({ item, scrollY, index = 0, onUpdateTask, onRemoveTask, onClick }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [isChecked, setChecked] = useState<boolean>(false);
    const [taskName, setTaskName] = useState<string>(item.name ?? '');
    const inputRef = useRef<TextInput>(null);

    const remainingTime = useMemo(() => {
      if (!item.deadline) return 'No deadline';

      const now = Date.now();
      const deadlineTime = item.deadline;
      const timeDiff = deadlineTime - now;

      if (timeDiff < 0) {
        return 'Overdue';
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days > 0) {
        return `${days}d ${hours}h left`;
      } else if (hours > 0) {
        return `${hours}h left`;
      } else {
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        return `${minutes}m left`;
      }
    }, [item.deadline]);

    const height = useSharedValue(120);
    const headerOpacity = useSharedValue(0);
    const checkboxOpacity = useSharedValue(1);
    const checkboxWidth = useSharedValue(18);
    const collapsedInfoOpacity = useSharedValue(1);
    const expandedInfoOpacity = useSharedValue(0);

    const priorityValue = useMemo((): PriorityValue => {
      switch (item.priority) {
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
    }, [item.priority]);

    useEffect(() => {
      height.value = withTiming(expanded ? 300 : 120, ANIMATION_CONFIG);

      headerOpacity.value = withTiming(expanded ? 1 : 0, ANIMATION_CONFIG);

      checkboxOpacity.value = withTiming(expanded ? 0 : 1, ANIMATION_CONFIG);

      checkboxWidth.value = withTiming(expanded ? 0 : 18, ANIMATION_CONFIG);

      collapsedInfoOpacity.value = withTiming(expanded ? 0 : 1, {
        ...ANIMATION_CONFIG,
        duration: 300,
      });

      expandedInfoOpacity.value = withTiming(expanded ? 1 : 0, {
        ...ANIMATION_CONFIG,
        duration: 300,
      });

      if (expanded) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }, [expanded]);

    useEffect(() => {
      if (expanded) {
        setTaskName(item.name || '');
      }
    }, [expanded, item.name]);

    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        height: height.value,
        minHeight: 120,
        maxHeight: 300,
      };
    });

    const animatedHeaderStyle = useAnimatedStyle(() => {
      return {
        opacity: headerOpacity.value,
        height: interpolate(headerOpacity.value, [0, 1], [0, 50]),
        overflow: 'hidden',
      };
    });

    const animatedCheckboxStyle = useAnimatedStyle(() => {
      return {
        opacity: checkboxOpacity.value,
        width: checkboxWidth.value,
        overflow: 'hidden',
      };
    });

    const animatedCollapsedContentStyle = useAnimatedStyle(() => {
      return {
        opacity: collapsedInfoOpacity.value,

        transform: [
          {
            translateY: interpolate(collapsedInfoOpacity.value, [0, 1], [10, 0]),
          },
        ],
      };
    });

    const animatedExpandedContentStyle = useAnimatedStyle(() => {
      return {
        opacity: expandedInfoOpacity.value,

        transform: [
          {
            translateY: interpolate(expandedInfoOpacity.value, [0, 1], [10, 0]),
          },
        ],
      };
    });

    const toggleExpand = useCallback(() => {
      setExpanded((prev) => !prev);
      if (onClick) onClick();
    }, [onClick]);

    const handleRemoveTask = useCallback((): void => {
      if (onRemoveTask) {
        onRemoveTask();
      }
    }, [onRemoveTask]);

    const handleSubmit = useCallback((): void => {
      if (onUpdateTask && taskName !== item.name && taskName.trim() !== '') {
        onUpdateTask(taskName);
      }
      toggleExpand();
    }, [onUpdateTask, taskName, item.name, toggleExpand]);

    const handleTextChange = useCallback((text: string) => {
      setTaskName(text);
    }, []);

    const cardScale = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * 120, index * 120, (index + 1) * 120];
      const scale = interpolate(scrollY.value, inputRange, [0.95, 1, 0.95]);

      return {
        transform: [{ scale }],
      };
    });

    const toggleCheckbox = useCallback(() => {
      setChecked((prev) => !prev);
    }, []);

    return (
      <Animated.View style={[styles.container, animatedContainerStyle, cardScale]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={toggleExpand} activeOpacity={0.8}>
          <Animated.View style={animatedHeaderStyle}>
            <TouchableOpacity
              style={styles.headerContainer}
              onPress={handleRemoveTask}
              activeOpacity={0.8}
            >
              <Ionicons name='trash' size={18} />
              <AppText.Paragraph
                text={localization['task']?.remove || 'Remove'}
                style={{ fontSize: 14 }}
              />
            </TouchableOpacity>
          </Animated.View>

          <View style={[styles.cardContainer, { gap: !expanded ? 16 : 0 }]}>
            <Animated.View style={[animatedCheckboxStyle, { marginTop: 16 }]}>
              <TouchableOpacity onPress={toggleCheckbox}>
                <Fontisto name={isChecked ? 'checkbox-active' : 'checkbox-passive'} size={18} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.infoContainer,
                animatedCollapsedContentStyle,
                { position: expanded ? 'absolute' : 'relative', zIndex: expanded ? 0 : 1 },
              ]}
            >
              <View style={styles.infoRow}>
                <AppText.Paragraph text={item.name || ''} style={{ fontWeight: '600' }} />
                <Ionicons name='pencil' size={14} />
              </View>
              <View style={styles.infoRow}>
                <AppText.Paragraph
                  text={priorityValue.text}
                  style={{ color: priorityValue.color }}
                />
                <AppText.Paragraph text={remainingTime} />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.infoContainer,
                animatedExpandedContentStyle,
                { position: expanded ? 'relative' : 'absolute', zIndex: expanded ? 1 : 0 },
              ]}
            >
              <Animated.View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  value={taskName}
                  onChangeText={handleTextChange}
                  style={styles.txtInput}
                  returnKeyType='done'
                  onSubmitEditing={handleSubmit}
                />
              </Animated.View>
              <View style={styles.infoRow}>
                <AppText.Paragraph
                  text={localization['task']?.date || 'Date'}
                  style={{ fontWeight: '600' }}
                />
                <AppText.Paragraph text={new Date(item.createdAt || '').toLocaleDateString()} />
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <AppText.Paragraph
                  text={localization['task']?.priority?.label || 'Priority'}
                  style={{ fontWeight: '600' }}
                />
                <AppText.Paragraph
                  text={priorityValue.text}
                  style={{ color: priorityValue.color }}
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.btnSubmit} activeOpacity={0.8} onPress={handleSubmit}>
                <AppText.Paragraph
                  text={localization['task']?.submit || 'Submit'}
                  style={styles.txtButtonSubmit}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

export default AppCard;
