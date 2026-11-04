import Navbar from "@/components/Navbar";
import BookingAndBrief from "@/components/BookingAndBrief";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a call & Send Brief · saketh_",
  description: "Schedule a 30-minute intro call or submit your project brief directly.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0F] text-[#F4F4F0] relative">
      <Navbar />
      <main className="flex-1">
        <BookingAndBrief />
      </main>
      <Footer />
    </div>
  );
}
