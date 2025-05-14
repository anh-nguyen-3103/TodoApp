import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import AppCard from '../../components/AppCard';
import { AppText } from '../../components/AppText';
import { TaskPriority } from '../../enums/priority';
import { localization } from '../../localization';
import { Task } from '../../models/task';
import { deleteTask, fetchTasks, saveTask } from '../../reducers/taskReducer';
import { AppDispatch, RootState } from '../../store';
import { HEADER_HEIGHT, styles } from './styles';

const HomeScreen: React.FC = () => {
  const { top, bottom } = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<Task>>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const scrollY = useSharedValue(0);
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.task);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, HEADER_HEIGHT * 0.5], [1, 0], 'clamp');

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [top || 0, -(HEADER_HEIGHT + (top || 0))],
      'clamp',
    );

    const scale = interpolate(scrollY.value, [0, HEADER_HEIGHT * 0.5], [1, 0.9], 'clamp');

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchTasks());
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadData();
  }, [dispatch]);

  const handleRemoveTask = useCallback(
    (taskId: string): void => {
      if (!taskId) return;
      dispatch(deleteTask(taskId));
    },
    [dispatch],
  );

  const handleUpdateTask = useCallback(
    (task: Task): void => {
      if (!task || !task.id) return;
      dispatch(saveTask(task));
    },
    [dispatch],
  );

  const handleCreateTask = useCallback((): void => {
    const timestamp = Date.now();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const deadlineTimestamp = timestamp + twoDaysInMs;

    const newTask: Task = {
      id: timestamp.toString(),
      name: `New Task ${new Date(timestamp).toLocaleDateString()}`,
      description: '',
      priority: TaskPriority.MEDIUM,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      deadline: deadlineTimestamp,
    };

    dispatch(saveTask(newTask));
  }, [dispatch]);
  const renderItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => {
      if (!item || !item.id) return null;

      return (
        <AppCard
          key={`task-${item.id}`}
          index={index}
          scrollY={scrollY}
          item={item}
          onUpdateTask={(updatedName: string) => {
            const taskToUpdate = tasks.find((t: Task) => t.id === item.id);
            if (!taskToUpdate) return;

            const updatedTask: Task = {
              ...taskToUpdate,
              name: updatedName,
              updatedAt: Date.now(),
            };
            handleUpdateTask(updatedTask);
          }}
          onClick={() => {
            if (!flatListRef.current) return;
            flatListRef.current.scrollToIndex({ index });
          }}
          onRemoveTask={() => handleRemoveTask(item.id)}
        />
      );
    },
    [handleRemoveTask, handleUpdateTask, scrollY, tasks],
  );

  const keyExtractor = useCallback((item: Task) => `task-${item.id}`, []);

  return !isReady && loading ? (
    <View style={[styles.container, { paddingTop: top }]}>
      <AppText.H3 style={styles.txtTitle} text='Loading...' />
    </View>
  ) : (
    <View style={[styles.container, { paddingTop: top }]}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <AppText.H3 style={styles.txtTitle} text={localization['home-page']?.title || 'Tasks'} />
      </Animated.View>

      <Animated.FlatList
        ref={flatListRef}
        data={tasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      <Animated.View style={[styles.footer, { bottom: bottom || 0 }]}>
        <TouchableOpacity
          style={styles.btnCreate}
          activeOpacity={0.8}
          onPress={handleCreateTask}
          disabled={loading}
        >
          <AppText.Paragraph
            style={styles.txtTitle}
            text={localization['task']?.create || 'Create Task'}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default HomeScreen;
