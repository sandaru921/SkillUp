import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { saveAssignment } from '../store/assignmentsSlice';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddAssignment({ navigation }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // For web, we'll use a text input with type="date"
  const [webDateValue, setWebDateValue] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const assignment = {
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      deadline: deadline.toISOString(),
    };

    dispatch(saveAssignment(assignment));
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      setDeadline(currentDate);
      setWebDateValue(currentDate.toISOString().split('T')[0]);
    }
    
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const onWebDateChange = (event) => {
    const dateString = event.target.value;
    setWebDateValue(dateString);
    const newDate = new Date(dateString + 'T00:00:00');
    setDeadline(newDate);
  };

  const renderDatePicker = () => {
    // For Web: Use HTML5 date input
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webDatePickerContainer}>
          <Text style={[styles.dateLabel, { color: theme.colors.onSurface }]}>
            Deadline *
          </Text>
          <input
            type="date"
            value={webDateValue}
            onChange={onWebDateChange}
            min={new Date().toISOString().split('T')[0]}
            style={{
              width: '100%',
              padding: 16,
              fontSize: 16,
              borderRadius: 4,
              border: `1px solid ${theme.colors.outline}`,
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              marginBottom: 16,
            }}
          />
        </View>
      );
    }

    // For iOS/Android: Use native DateTimePicker
    return (
      <>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
          icon="calendar"
          contentStyle={styles.dateButtonContent}
        >
          Deadline: {deadline.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <Text style={[styles.header, { color: theme.colors.primary }]}>
          Add New Assignment 📝
        </Text>

        <TextInput
          label="Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., Math Homework Chapter 5"
        />

        <TextInput
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., Mathematics"
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Add details about this assignment..."
        />

        {renderDatePicker()}

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save Assignment
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 16,
  },
  dateButtonContent: {
    paddingVertical: 8,
  },
  webDatePickerContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});