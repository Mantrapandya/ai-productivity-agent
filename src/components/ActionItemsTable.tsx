import React, { useState } from 'react';
import {
  CheckSquare,
  Copy,
  Check,
  Search,
  Plus,
  User,
  Calendar,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';
import { ActionItem, PriorityLevel, TaskStatus } from '../types';
import { formatActionItemsTSV } from '../utils/exportUtils';

interface ActionItemsTableProps {
  items: ActionItem[];
  onUpdateItems: (items: ActionItem[]) => void;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const ActionItemsTable: React.FC<ActionItemsTableProps> = ({
  items = [],
  onUpdateItems,
  onCopy,
  copiedLabel,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<Partial<ActionItem>>({
    task: '',
    assignee: 'Not specified',
    deadline: 'No deadline',
    priority: 'Medium',
    status: 'Not Started',
  });

  const isCopied = copiedLabel === 'Action Items';
  const itemList = Array.isArray(items) ? items : [];

  // Toggle status
  const handleToggleStatus = (id: string) => {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      'Not Started': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Not Started',
    };

    const updated = itemList.map((item) => {
      if (item.id === id) {
        return { ...item, status: nextStatusMap[item.status] || 'Not Started' };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    onUpdateItems(itemList.filter((item) => item.id !== id));
  };

  // Add task
  const handleSaveNewTask = () => {
    if (!newTask.task?.trim()) return;
    const item: ActionItem = {
      id: `custom-${Date.now()}`,
      task: newTask.task.trim(),
      assignee: newTask.assignee?.trim() || 'Not specified',
      deadline: newTask.deadline?.trim() || 'No deadline',
      priority: (newTask.priority as PriorityLevel) || 'Medium',
      status: (newTask.status as TaskStatus) || 'Not Started',
    };
    onUpdateItems([...itemList, item]);
    setNewTask({
      task: '',
      assignee: 'Not specified',
      deadline: 'No deadline',
      priority: 'Medium',
      status: 'Not Started',
    });
    setIsAddingTask(false);
  };

  // Copy as Markdown
  const handleCopyMarkdown = () => {
    let md = '| Task | Assignee | Deadline | Priority | Status |\n';
    md += '| :--- | :--- | :--- | :--- | :--- |\n';
    itemList.forEach((item) => {
      md += `| ${(item?.task || 'Task').replace(/\|/g, '-')} | ${item?.assignee || 'Not specified'} | ${item?.deadline || 'No deadline'} | ${item?.priority || 'Medium'} | ${item?.status || 'Not Started'} |\n`;
    });
    onCopy(md, 'Action Items');
  };

  // Copy as TSV (Spreadsheets)
  const handleCopyTSV = () => {
    const tsv = formatActionItemsTSV(itemList);
    onCopy(tsv, 'Action Items (TSV for Sheets)');
  };

  // Filtered items
  const filteredItems = itemList.filter((item) => {
    const taskName = item?.task || '';
    const assigneeName = item?.assignee || '';
    const deadlineStr = item?.deadline || '';

    const matchesSearch =
      taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assigneeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deadlineStr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Calculate metrics
  const completedCount = itemList.filter((i) => i.status === 'Completed').length;
  const progressPercent = itemList.length > 0 ? Math.round((completedCount / itemList.length) * 100) : 0;

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {priority}
          </span>
        );
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Check className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5 animate-pulse" />
            In Progress
          </span>
        );
      case 'Not Started':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/80">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden transition-all hover:border-slate-700/80">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono">
            03
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>Action Items Matrix</span>
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {items.length} tasks
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Extracted operational tasks with owners, deadlines, and priorities
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/30 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
          <button
            onClick={handleCopyTSV}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-colors shadow-xs"
            title="Copy for Excel or Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sheets TSV</span>
          </button>
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-colors shadow-xs"
            title="Copy as Markdown table"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-5 sm:px-6 py-2.5 bg-[#0A0E1A] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[200px] max-w-sm">
          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-slate-300 shrink-0 text-[11px]">
            {completedCount}/{items.length} completed ({progressPercent}%)
          </span>
        </div>

        <span className="text-slate-500 text-[11px] font-mono">
          Click status pill to cycle: Not Started → In Progress → Completed
        </span>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="p-3.5 bg-slate-900/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks, assignees, deadlines..."
            className="w-full text-xs text-slate-200 placeholder-slate-500 bg-[#0D1322] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 text-[11px] mr-1">Priority:</span>
            {['All', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  priorityFilter === p
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <span className="text-slate-500 text-[11px] mr-1">Status:</span>
            {['All', 'Not Started', 'In Progress', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Task Form (Collapsible) */}
      {isAddingTask && (
        <div className="p-4 bg-indigo-950/20 border-b border-indigo-500/20">
          <h4 className="text-xs font-bold text-indigo-300 mb-2">Add New Operational Action Item</h4>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-5">
              <input
                type="text"
                value={newTask.task || ''}
                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                placeholder="Task description"
                className="w-full text-xs bg-[#0D1322] border border-slate-700 text-slate-100 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                value={newTask.assignee || ''}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                placeholder="Assignee"
                className="w-full text-xs bg-[#0D1322] border border-slate-700 text-slate-100 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                value={newTask.deadline || ''}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                placeholder="Deadline"
                className="w-full text-xs bg-[#0D1322] border border-slate-700 text-slate-100 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-1">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as PriorityLevel })}
                className="w-full text-xs bg-[#0D1322] border border-slate-700 text-slate-100 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex items-center gap-1.5">
              <button
                onClick={handleSaveNewTask}
                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Save
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0A0E1A] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
              <th className="py-3 px-4 w-12 text-center">Done</th>
              <th className="py-3 px-4 min-w-[240px]">Task Description</th>
              <th className="py-3 px-4 w-36">Assignee</th>
              <th className="py-3 px-4 w-32">Deadline</th>
              <th className="py-3 px-4 w-24">Priority</th>
              <th className="py-3 px-4 w-32">Status</th>
              <th className="py-3 px-3 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No action items match the current filters.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isCompleted = item.status === 'Completed';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCompleted ? 'bg-slate-950/40 opacity-60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-700 hover:border-indigo-400 bg-slate-900'
                        }`}
                      >
                        {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    </td>

                    {/* Task */}
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${
                          isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {item.task}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span
                          className={`font-medium ${
                            item.assignee === 'Not specified'
                              ? 'text-slate-500 italic'
                              : 'text-slate-300'
                          }`}
                        >
                          {item.assignee}
                        </span>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span
                          className={`font-mono text-[11px] ${
                            item.deadline === 'No deadline'
                              ? 'text-slate-500 italic'
                              : 'text-indigo-300 font-semibold'
                          }`}
                        >
                          {item.deadline}
                        </span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4">{getPriorityBadge(item.priority)}</td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        title="Click to advance status"
                      >
                        {getStatusBadge(item.status)}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(item.id)}
                        className="text-slate-600 hover:text-rose-400 transition-colors p-1 rounded"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
