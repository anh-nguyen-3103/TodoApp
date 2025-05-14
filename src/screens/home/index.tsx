import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
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

  const scrollY = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.task);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchTasks());
        setIsReady(true);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
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
    const newTask: Task = {
      id: timestamp.toString(),
      name: `New Task`,
      description: '',
      priority: TaskPriority.MEDIUM,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
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
          name={item.name}
          date={new Date(item.createdAt).toDateString()}
          priority={item.priority}
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

  const animatedScrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  if (!isReady && loading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <AppText.H3 style={styles.txtTitle} text='Loading...' />
      </View>
    );
  }

  const opacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [top || 0, -(HEADER_HEIGHT + (top || 0))],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: opacity,
            transform: [{ translateY: translateY }, { scale: scale }],
          },
        ]}
      >
        <AppText.H3 style={styles.txtTitle} text={localization['home-page']?.title || 'Tasks'} />
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={tasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        onScroll={animatedScrollHandler}
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
