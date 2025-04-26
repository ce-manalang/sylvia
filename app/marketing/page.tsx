import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, MessageSquare, Trophy, Star, ArrowRight } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60  px-4 md:px-6">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-purple-800">YASCG</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-to-play"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              How to Play
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div>
            <Link href="/" passHref>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-purple-800">
                  Get to Know Your Friends Better
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  YASCG is a fun, interactive card game that helps you discover
                  surprising insights about your friends and family through
                  engaging questions and answers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/" passHref>
                    <Button className="bg-purple-600 hover:bg-purple-700 h-12 px-8">
                      Start Playing
                    </Button>
                  </Link>
                  <Link href="#how-to-play" passHref>
                    <Button variant="outline" className="h-12 px-8">
                      Learn How
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[350px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/mobile-card-game-friends.png"
                  alt="Friends playing YASCG"
                  fill
                  priority={false}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                  Game Features
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover what makes YASCG the perfect game for parties,
                  team-building, or just hanging out with friends.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <CardTitle>Multiplayer Fun</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Play with friends anywhere, anytime. Create a room, share
                      the code, and start playing instantly.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      <CardTitle>Thought-Provoking Questions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      From casual to deep, our questions are designed to spark
                      interesting conversations and reveal surprising insights.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-purple-600" />
                      <CardTitle>Competitive Scoring</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Earn points for your answers and climb the leaderboard.
                      Who knows their friends best?
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/modern-mobile-interface.png"
                  alt="YASCG app interface"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How to Play Section */}
        <section
          id="how-to-play"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-purple-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                  How to Play
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Getting started with YASCG is easy. Follow these simple steps:
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <Card className="relative">
                <div className="absolute -top-4 -left-4 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <CardHeader>
                  <CardTitle>Create or Join a Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Start a new game room or join an existing one with a room
                    code. Enter your name to get started.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-4 -left-4 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <CardHeader>
                  <CardTitle>Draw Question Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Type "/card" to draw a random question about another player.
                    Answer questions about others in the chat.
                  </p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-4 -left-4 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <CardHeader>
                  <CardTitle>Rate Answers & Score Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Review and rate answers about yourself. Earn points for good
                    answers and accurate ratings.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                  What Players Say
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it. Here's what our players think
                  about YASCG.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "I learned more about my friends in one game than I had in months of hanging out!",
                  name: "Jamie S.",
                  title: "College Student",
                },
                {
                  quote:
                    "We use this for team building at work. It's been amazing for breaking the ice with new hires.",
                  name: "Michael T.",
                  title: "Team Manager",
                },
                {
                  quote:
                    "My family plays this every holiday gathering now. So much fun and surprisingly deep!",
                  name: "Sarah K.",
                  title: "Family Game Night Host",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="relative">
                  <CardContent className="pt-6">
                    <div className="absolute -top-4 left-4 text-purple-600">
                      <Star className="h-8 w-8 fill-purple-600" />
                    </div>
                    <blockquote className="border-l-4 border-purple-200 pl-4 italic text-gray-600">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="mt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.title}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-blue-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Got questions? We've got answers.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl py-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How many players can join a room?
                  </AccordionTrigger>
                  <AccordionContent>
                    YASCG works best with 3-8 players, but technically there's
                    no upper limit. The more players, the more diverse and
                    interesting the answers!
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Do I need to create an account?
                  </AccordionTrigger>
                  <AccordionContent>
                    No account needed! Just enter your name and a room code to
                    start playing immediately.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is YASCG free to play?</AccordionTrigger>
                  <AccordionContent>
                    Yes, YASCG is completely free to play. We may add premium
                    question packs in the future, but the core game will always
                    be free.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Can I play with remote friends?
                  </AccordionTrigger>
                  <AccordionContent>
                    YASCG is designed for both in-person and remote play. Just
                    share the room code with your friends, and they can join
                    from anywhere.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Are the questions appropriate for all ages?
                  </AccordionTrigger>
                  <AccordionContent>
                    Our default questions are family-friendly and appropriate
                    for players 13+. We focus on fun, thoughtful questions that
                    spark conversation without being inappropriate.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-800 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Play?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Gather your friends, create a room, and start discovering
                  surprising things about each other.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" passHref>
                  <Button className="bg-white text-purple-800 hover:bg-gray-100 h-12 px-8">
                    Start Playing Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-800">YASCG</span>
            <p className="text-sm text-gray-500">
              © 2023 Yet Another Strangers Card Game
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
