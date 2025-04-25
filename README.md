# Yet Another Strangers Card Game

A real-time, mobile-optimized web application that lets friends play a question-based game together. Players can create rooms, join existing ones, and take turns answering questions about each other.

![Yet Another Strangers Card Game](/placeholder.svg?height=400&width=800&query=mobile%20chat%20app%20with%20question%20cards%20interface)

## Features

- **Mobile-First Design**: Optimized for mobile web browsers
- **Real-Time Chat**: Communicate with other players in the room
- **Question Cards**: Draw cards with questions about other players
- **Room System**: Create or join game rooms with a simple code
- **User Profiles**: Each player has their own identity in the game
- **Answer Reviews**: View answers about specific players
- **Progressive Difficulty**: Questions range from easy to challenging
- **Touch-Optimized**: Large touch targets and mobile-friendly interactions

## Technologies Used

- **Next.js**: React framework for the frontend
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **React Hooks**: For state management
- **Mobile Optimizations**: Viewport handling, touch events, etc.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ce-manalang/sylvia.git
   cd sylvia
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Play

1. **Create or Join a Room**:
   - Enter your name and either create a new room or join an existing one with a room code
   - Share the room code with friends so they can join

2. **Draw Question Cards**:
   - Type `/card` in the chat to draw a random question about a random player
   - Type `/card [username]` to draw a question about a specific player

3. **Answer Questions**:
   - When a question is drawn about another player, type your answer in the chat
   - If a question is about you, wait for others to answer

4. **View Answers**:
   - Click on a player's name in the player list to see all answers about them

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy with default settings

### Mobile Web App Setup

To make the app installable on mobile devices:

1. Create app icons and place them in the `public` folder
2. Add a web app manifest as described in the code
3. Update `layout.tsx` with the appropriate meta tags

## Project Structure

```
question-card-game/
├── app/                  # Next.js app directory
│   ├── page.tsx          # Home page (join/create room)
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── room/[roomId]/    # Dynamic room routes
├── components/           # React components
│   ├── chat-message.tsx  # Chat message component
│   ├── user-list.tsx     # User list component
│   └── ui/               # UI components from shadcn
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and types
│   ├── questions.ts      # Question generation
│   └── types.ts          # TypeScript types
├── public/               # Static assets
└── README.md             # This file
```

## Future Improvements

- [ ] Add persistent storage with a database
- [ ] Implement real-time functionality with WebSockets
- [ ] Enable offline support with PWA capabilities
- [ ] Implement custom question packs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
