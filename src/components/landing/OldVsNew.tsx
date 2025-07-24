import {
  CalendarCheck,
  Check,
  Clock,
  FileWarning,
  FireExtinguisher,
  FolderCheck,
  FolderMinus,
  Link2,
  MailWarning,
  MessageCircle,
  MessageCircleWarning,
  Smile,
  X,
} from 'lucide-react';
import Image from 'next/image';

const OldVsNew = () => (
  <section aria-label="Old vs New Comparison" className="relative px-6 py-24">
    <div className="mx-auto max-w-6xl">
      <div className="mb-16 text-center">
        <h2 className="mb-6 font-head font-medium text-4xl sm:text-5xl">
          How Staged changes client work
        </h2>
        <p className="mx-auto max-w-3xl text-muted-foreground text-xl">
          See the difference between the old way of managing projects and the
          clarity you get with Staged.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-6 ">
        <div className="flex flex-1 flex-col rounded-2xl border bg-background p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-3 font-bold text-2xl text-red-600">
            <X
              aria-hidden="true"
              className="h-7 w-7 rounded-full bg-red-100 p-1.5 text-red-600"
            />
            The Old Way
          </h3>
          <ul className="flex-1 space-y-4 text-muted-foreground">
            {/* Reason 1 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-red-50 p-4">
              <MailWarning className="h-8 w-8 rounded-lg border border-red-200 bg-white p-1.5 text-red-500" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Lost in Email
                </div>
                <div className="text-gray-600 text-xs">
                  Files and updates buried in endless threads
                </div>
              </div>
            </div>
            {/* Reason 2 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-red-50 p-4">
              <FolderMinus className="h-8 w-8 rounded-lg border border-red-200 bg-white p-1.5 text-red-500" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Scattered Links
                </div>
                <div className="text-gray-600 text-xs">
                  Folders and files spread across platforms
                </div>
              </div>
            </div>
            {/* Reason 3 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-red-50 p-4">
              <MessageCircleWarning className="h-8 w-8 rounded-lg border border-red-200 bg-white p-1.5 text-red-500" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Feedback Chaos
                </div>
                <div className="text-gray-600 text-xs">
                  Comments lost in chat apps and docs
                </div>
              </div>
            </div>
            {/* Reason 4 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-red-50 p-4">
              <Clock className="h-8 w-8 rounded-lg border border-red-200 bg-white p-1.5 text-red-500" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Missed Deadlines
                </div>
                <div className="text-gray-600 text-xs">
                  No clear timeline or next steps
                </div>
              </div>
            </div>
            {/* Reason 5 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-red-50 p-4">
              <FileWarning className="h-8 w-8 rounded-lg border border-red-200 bg-white p-1.5 text-red-500" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Version Confusion
                </div>
                <div className="text-gray-600 text-xs">
                  Clients unsure which file is the latest
                </div>
              </div>
            </div>
          </ul>
        </div>
        <div className="rounded-full bg-muted p-3 flex justify-center">
        
        <h1 className="font-bold  ">VS</h1>
        </div>
        <div className="flex flex-1 flex-col rounded-2xl border bg-background p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-3 font-bold text-2xl text-green-700">
            <Check
              aria-hidden="true"
              className="h-7 w-7 rounded-full bg-green-100 p-1.5 text-green-700"
            />
            The Staged Way
          </h3>
          <ul className="flex-1 space-y-4 text-muted-foreground">
            {/* Benefit 1 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-green-50 p-4">
              <FolderCheck className="h-8 w-8 rounded-lg border border-green-200 bg-white p-1.5 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Everything Organized
                </div>
                <div className="text-gray-600 text-xs">
                  All files, links, and updates in one portal
                </div>
              </div>
            </div>
            {/* Benefit 2 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-green-50 p-4">
              <MessageCircle className="h-8 w-8 rounded-lg border border-green-200 bg-white p-1.5 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Centralized Feedback
                </div>
                <div className="text-gray-600 text-xs">
                  Clients chat and comment directly in the portal
                </div>
              </div>
            </div>
            {/* Benefit 3 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-green-50 p-4">
              <CalendarCheck className="h-8 w-8 rounded-lg border border-green-200 bg-white p-1.5 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Milestone Clarity
                </div>
                <div className="text-gray-600 text-xs">
                  Clients always know what's next
                </div>
              </div>
            </div>
            {/* Benefit 4 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-green-50 p-4">
              <Link2 className="h-8 w-8 rounded-lg border border-green-200 bg-white p-1.5 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  No More Lost Links
                </div>
                <div className="text-gray-600 text-xs">
                  Every file and folder is easy to find
                </div>
              </div>
            </div>
            {/* Benefit 5 */}
            <div className="mb-3 flex items-start space-x-4 rounded-lg bg-green-50 p-4">
              <Smile className="h-8 w-8 rounded-lg border border-green-200 bg-white p-1.5 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  Clients Actually Happy
                </div>
                <div className="text-gray-600 text-xs">
                  No more confusion, just clear progress
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default OldVsNew;
