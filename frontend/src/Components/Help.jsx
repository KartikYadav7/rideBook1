import Button from "./Button";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function FAQItem({ question, answer }) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <div
        className=" p-4 bg-[#1e1e1e] rounded flex justify-between items-center cursor-pointer"
        onClick={() => setShow((prev) => !prev)}
      >
        <span className="font-medium">{question}</span>
        <span className={`transition-transform duration-300 `}>
          {show ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </div>

      {show && (
        <div className="mt-2 p-4 bg-[#2a2a2a] rounded text-sm">{answer}</div>
      )}
    </div>
  );
}

const userFaqList = [
  {
    question: "How do I book a ride?",
    answer: "You can book a ride using our app or website easily.",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Yes, you can cancel or reschedule from the bookings section in your profile.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept credit/debit cards, UPI, and most digital wallets.",
  },
  {
    question: "Is customer support available 24/7?",
    answer:
      "Yes, our customer support is available 24/7 via chat, email, and phone.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No, we maintain full transparency. All applicable charges are shown during booking.",
  },
];

const driverFaqList = [
  {
    question: "How do I accept a ride request?",
    answer: "You will receive ride requests in your driver dashboard. Accept or decline as per your availability.",
  },
  {
    question: "How do I update my availability?",
    answer: "Go to your profile and set your status to available or unavailable.",
  },
  {
    question: "How do I get paid?",
    answer: "Payments are processed weekly to your registered bank account.",
  },
  {
    question: "What if a rider cancels?",
    answer: "You will be notified instantly. Cancellation policies may apply.",
  },
  {
    question: "How do I contact support?",
    answer: "You can contact support via the app or website, or call our driver helpline.",
  },
];

export default function FAQSection() {
  const user = useSelector(state => state.user.user);
  const role = user?.userRole;
  const faqList = role === "driver" ? driverFaqList : userFaqList;
  return (
    <section className="bg-[#414141] text-[#e0e0e0] py-12 px-6 text-center">
      <h2 className="text-4xl text-primary font-bold mb-4">Need Assistance?</h2>
      <p className="text-xl mb-1">
        We're here to help! Browse through our frequently asked questions or
        contact our support team.
      </p>
      <div className="max-w-[800px] mx-auto text-left my-8">
        {faqList.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      <p className="text-lg font-medium">Contact Support</p>
      <p className="my-2">
        If you need further assistance, please reach out to us directly.
      </p>
      <Link to="/contact" className="mt-2">
        <Button text="Contact Support" className={`mt-2`} />
      </Link>
    </section>
  );
}
