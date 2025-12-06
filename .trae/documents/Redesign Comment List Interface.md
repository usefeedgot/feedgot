I will redesign the `CommentItem` component to match the reference image and requirements.

### **1. Layout Restructuring (CommentItem.tsx)**
- **Header Area**:
  - Update the header container to use `flex justify-between`.
  - Move the **Action Menu** (3 dots) from the footer to the top-right corner of the header.
  - Ensure the menu trigger is visible and aligned correctly.

- **Footer Area**:
  - Change the footer container to `flex items-center justify-between mt-2`.
  - **Left Side**: Place the **Reaction Display** (`CommentVote`) here.
  - **Right Side**: Place the **Reply Button** (`CommentReplyButton`) here.

### **2. Component Styling Updates**
- **Reply Button**:
  - Style the `CommentReplyButton` to match the reference (pill-shaped, subtle background) using Tailwind classes (e.g., `px-3 py-1 rounded-full bg-muted/50 hover:bg-muted text-xs`).
- **Action Menu**:
  - Ensure the 3-dot icon (`MoreHorizontal`) has the correct visual hierarchy (subtle gray, hover effect).
- **Spacing**:
  - Adjust margins and padding to match the "pixel-perfect" requirement (consistent spacing between text and footer).

### **3. Implementation Details**
- **File**: `apps/feed/src/components/comments/CommentItem.tsx`
- **Accessibility**: Ensure tab order is logical (Author -> Content -> Reactions -> Reply -> Actions).
- **Responsiveness**: The `justify-between` layout will naturally adapt to mobile screens.

No changes are needed for the logic of `CommentVote` or `CommentActions`, only their placement and styling.