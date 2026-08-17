import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { getCoursesAdmin, createCourseAdmin, updateCourseAdmin, deleteCourseAdmin } from '../services/adminApi';
import { Plus, Trash2, Edit, Video, CheckCircle, X, Upload, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ManageCourses() {
  const { darkMode } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [instructor, setInstructor] = useState('Mr. Haile');
  const [category, setCategory] = useState('Development');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  
  const defaultLessonsPreset = [
    { title: 'Lesson 1: Introduction', bunnyVideoId: '', youtubeUrl: '', duration: '10:00', freePreview: true, videoFile: null },
    { title: 'Lesson 2: Core Concepts', bunnyVideoId: '', youtubeUrl: '', duration: '25:00', freePreview: false, videoFile: null },
    { title: 'Lesson 3: Finalizing & Projects', bunnyVideoId: '', youtubeUrl: '', duration: '30:00', freePreview: false, videoFile: null }
  ];

  const [lessons, setLessons] = useState(defaultLessonsPreset);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getCoursesAdmin();
      setCourses(res.data.courses || res.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses([
        { 
          _id: '1', 
          title: 'Advanced Development', 
          description: 'Learn advance LMS engineering and modern web stacks',
          price: 1500, 
          instructor: 'Mr. Haile',
          category: 'Development', 
          thumbnail: '',
          lessons: defaultLessonsPreset,
          students: 24 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCourseId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setInstructor('Mr. Haile');
    setCategory('Development');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setLessons(defaultLessonsPreset);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourseId(course._id || course.id);
    setTitle(course.title || '');
    setDescription(course.description || '');
    setPrice(course.price || '');
    setInstructor(course.instructor || 'Mr. Haile');
    setCategory(course.category || 'Development');
    setThumbnailPreview(course.thumbnail || '');
    setThumbnailFile(null);
    setLessons(course.lessons && course.lessons.length > 0 ? course.lessons.map(l => ({ ...l, youtubeUrl: l.youtubeUrl || '', bunnyVideoId: l.bunnyVideoId || '' })) : defaultLessonsPreset);
    setIsModalOpen(true);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAddLessonField = () => {
    setLessons([...lessons, { title: '', bunnyVideoId: '', youtubeUrl: '', duration: '', freePreview: false, videoFile: null }]);
  };

  const handleLoadPresetLessons = () => {
    setLessons(defaultLessonsPreset);
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const handleLessonFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...lessons];
      updated[index].videoFile = file;
      setLessons(updated);
    }
  };

  const handleRemoveLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('instructor', instructor);
      formData.append('category', category);
      
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const cleanLessons = lessons.filter(l => l.title.trim() !== '').map(({ videoFile, ...rest }) => rest);
      formData.append('lessons', JSON.stringify(cleanLessons));

      lessons.forEach((lesson, index) => {
        if (lesson.videoFile) {
          formData.append(`lessonvideo-${index}`, lesson.videoFile);
        }
      });

      if (editingCourseId) {
        await updateCourseAdmin(editingCourseId, formData);
        setSuccessMsg('Course successfully updated in database!');
      } else {
        await createCourseAdmin(formData);
        setSuccessMsg('Course successfully created & uploaded to database!');
      }

      setIsModalOpen(false);
      fetchCourses();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to save course. Please check backend connection.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourseAdmin(id);
      setCourses(courses.filter(c => (c._id || c.id) !== id));
      setSuccessMsg('Course deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Delete course error:', err);
      setCourses(courses.filter(c => (c._id || c.id) !== id));
      setSuccessMsg('Course removed from view.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-6 flex-1">
          <div className={`p-6 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Course Management (LMS)</h1>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create, update, and manage video courses (supports YouTube Embedded URLs or Bunny.net / Local Video uploads).</p>
            </div>
            <button 
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-2 text-sm shadow-sm"
            >
              <Plus size={16} />
              <span>Add New Course</span>
            </button>
          </div>

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
              <X size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-base">Active Course Catalog ({courses.length})</h3>
            </div>
            {loading ? (
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No courses found in database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`uppercase text-[11px] font-bold tracking-wider border-b ${darkMode ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    <tr>
                      <th className="px-6 py-3.5">Course Title</th>
                      <th className="px-6 py-3.5">Instructor</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Price</th>
                      <th className="px-6 py-3.5">Lessons</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {courses.map((course) => {
                      const courseId = course._id || course.id;
                      return (
                        <tr key={courseId} className={`transition-none ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4 font-medium flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-blue-500 overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                              {course.thumbnail ? (
                                <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Video size={18} />
                              )}
                            </div>
                            <div>
                              <div className="font-bold">{course.title}</div>
                              <div className={`text-xs truncate max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{course.description}</div>
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{course.instructor || 'Mr. Haile'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                              {course.category || 'Development'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-emerald-500 font-bold">{course.price} ETB</td>
                          <td className={`px-6 py-4 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{course.lessons?.length || 0} lessons</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => handleOpenEditModal(course)} 
                              className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-semibold text-xs border border-blue-500/20"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(courseId)} 
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-xs border border-red-500/20"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 relative my-8 shadow-xl ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">{editingCourseId ? 'Update Video Course' : 'Add New Video Course & Lessons'}</h3>
            <form onSubmit={handleSubmitCourse} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Course Title</label>
                  <input 
                    type="text" 
                    required
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Advanced Video Editing"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  >
                    <option value="Basic Internet Skills">Basic Internet Skills</option>
                    <option value="Development">Development</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Color Grading">Color Grading</option>
                    <option value="VFX">VFX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price (ETB)</label>
                  <input 
                    type="number" 
                    required
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1500"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Instructor</label>
                  <input 
                    type="text" 
                    required
                    value={instructor} 
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="e.g. Mr. Haile"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description</label>
                <textarea 
                  required
                  rows="3"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed course description..."
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Thumbnail Image</label>
                <div className="flex items-center space-x-4">
                  <label className={`flex-1 flex items-center justify-center space-x-2 border border-dashed rounded-xl px-4 py-3 cursor-pointer text-xs font-medium ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                    <Upload size={16} className="text-blue-500" />
                    <span className="truncate">{thumbnailFile ? thumbnailFile.name : 'Choose thumbnail image...'}</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                  {thumbnailPreview && (
                    <div className="w-14 h-10 rounded-lg border border-gray-700 overflow-hidden bg-gray-800 flex-shrink-0">
                      <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className={`border-t pt-4 space-y-4 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">Course Lessons</h4>
                  <div className="flex space-x-2">
                    <button 
                      type="button" 
                      onClick={handleLoadPresetLessons}
                      className="text-xs font-semibold text-purple-500 flex items-center space-x-1 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20"
                    >
                      <Sparkles size={12} />
                      <span>Preset</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleAddLessonField}
                      className="text-xs font-semibold text-blue-500 flex items-center space-x-1 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
                    >
                      <Plus size={12} />
                      <span>Add Lesson</span>
                    </button>
                  </div>
                </div>

                {lessons.map((lesson, index) => (
                  <div key={index} className={`p-3.5 rounded-xl border space-y-2.5 ${darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lesson #{index + 1}</span>
                      {lessons.length > 1 && (
                        <button type="button" onClick={() => handleRemoveLesson(index)} className="text-red-500 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <input 
                        type="text" 
                        placeholder="Lesson Title"
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      />
                      <input 
                        type="text" 
                        placeholder="YouTube Embedded URL"
                        value={lesson.youtubeUrl}
                        onChange={(e) => handleLessonChange(index, 'youtubeUrl', e.target.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <input 
                        type="text" 
                        placeholder="Bunny Video ID"
                        value={lesson.bunnyVideoId}
                        onChange={(e) => handleLessonChange(index, 'bunnyVideoId', e.target.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      />
                      <input 
                        type="text" 
                        placeholder="Duration (e.g. 10:00)"
                        value={lesson.duration}
                        onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 items-center">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-blue-500 mb-1">Local Video File</label>
                        <label className={`flex items-center space-x-2 border border-dashed rounded-lg px-2.5 py-1.5 cursor-pointer text-xs ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                          <Upload size={12} className="text-blue-500" />
                          <span className="truncate">{lesson.videoFile ? lesson.videoFile.name : 'Upload local video...'}</span>
                          <input 
                            type="file" 
                            accept="video/*"
                            onChange={(e) => handleLessonFileChange(index, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex items-center pt-4">
                        <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={lesson.freePreview}
                            onChange={(e) => handleLessonChange(index, 'freePreview', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-0"
                          />
                          <span>Free Preview</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex space-x-3">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm">
                  {editingCourseId ? 'Update Course' : 'Save & Publish Course'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-5 py-2.5 rounded-xl border font-semibold text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
