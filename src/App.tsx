import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { BookmarkDetailScreen, NewBookmarkScreen } from './screens/BookmarkEditorScreen';
import { BookmarksScreen } from './screens/BookmarksScreen';
import { CheckInScreen } from './screens/CheckInScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MomentDetailScreen, NewMomentScreen } from './screens/MomentDetailScreen';
import { MomentsScreen } from './screens/MomentsScreen';
import { NewSpaceScreen } from './screens/NewSpaceScreen';
import { NoteEditorScreen } from './screens/NoteEditorScreen';
import { PhotoCheckInScreen } from './screens/PhotoCheckInScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SpaceDetailScreen } from './screens/SpaceDetailScreen';
import { SpacesScreen } from './screens/SpacesScreen';
import { TaskDetailScreen, TaskEditorScreen } from './screens/TaskEditorScreen';
import { TasksScreen } from './screens/TasksScreen';
import { VoiceScreen } from './screens/VoiceScreen';

export default function App() {
  return (
    <div className="desktop-root">
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/spaces" element={<SpacesScreen />} />
          <Route path="/spaces/new" element={<NewSpaceScreen />} />
          <Route path="/spaces/:id" element={<SpaceDetailScreen />} />
          <Route path="/tasks" element={<TasksScreen />} />
          <Route path="/tasks/new" element={<TaskEditorScreen />} />
          <Route path="/tasks/:id" element={<TaskDetailScreen />} />
          <Route path="/tasks/:id/edit" element={<TaskEditorScreen />} />
          <Route path="/notes/new" element={<NoteEditorScreen />} />
          <Route path="/notes/:id" element={<NoteEditorScreen />} />
          <Route path="/check-in" element={<CheckInScreen />} />
          <Route path="/check-in/photo" element={<PhotoCheckInScreen />} />
          <Route path="/moments" element={<MomentsScreen />} />
          <Route path="/moments/new" element={<NewMomentScreen />} />
          <Route path="/moments/:id" element={<MomentDetailScreen />} />
          <Route path="/bookmarks" element={<BookmarksScreen />} />
          <Route path="/bookmarks/new" element={<NewBookmarkScreen />} />
          <Route path="/bookmarks/:id" element={<BookmarkDetailScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/voice" element={<VoiceScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
