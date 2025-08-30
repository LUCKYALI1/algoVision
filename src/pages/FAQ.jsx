import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

// --- Hardcoded FAQs (Unchanged) ---
const builtInFaqs = [
  {
    id: 'b1',
    question: 'What is AlgoVision?',
    answer: 'AlgoVision is an interactive learning platform for data structures and algorithms. We provide a unique combination of detailed articles, interactive visualizations, and practice problems to help you master DSA concepts.',
    order: 1,
  },
  {
    id: 'b2',
    question: 'Who is this platform for?',
    answer: 'AlgoVision is designed for students, self-taught developers, and anyone preparing for technical interviews. Whether you are a beginner or looking to refresh your knowledge, our platform has something for you.',
    order: 2,
  },
  {
    id: 'b3',
    question: 'How do the interactive visualizers work?',
    answer: 'Our visualizers provide a step-by-step animation of how algorithms work. You can control the execution speed, step through the code, and see how the data structures change in real-time. This helps in building a strong mental model of the algorithms.',
    order: 3,
  },
  {
    id: 'b4',
    question: 'Is there a cost to use AlgoVision?',
    answer: 'Currently, AlgoVision is free to use. We believe in providing accessible education for everyone. In the future, we may introduce premium features, but our core content will always remain free.',
    order: 4,
  },
  {
    id: 'b5',
    question: 'How can I contribute or provide feedback?',
    answer: 'We love hearing from our users! You can submit your questions or feedback through the form on this page. If you are interested in contributing, please contact us at contact@algovision.com.',
    order: 5,
  },
];


// --- Main FAQ Component ---
export default function FaqComponent() {
  const { user } = useAuth();
  const [openFaqId, setOpenFaqId] = useState(null);
  const [faqs, setFaqs] = useState(builtInFaqs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [formMessage, setFormMessage] = useState('');

  // --- Data Fetching Logic (Unchanged) ---
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqsCollection = collection(db, 'faq');
        const q = query(faqsCollection, orderBy('order'));
        const querySnapshot = await getDocs(q);
        const faqsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const combinedFaqs = [...builtInFaqs];
        faqsData.forEach(faq => {
          if (!combinedFaqs.some(bFaq => bFaq.question === faq.question)) {
            combinedFaqs.push(faq);
          }
        });
        
        combinedFaqs.sort((a, b) => a.order - b.order);
        setFaqs(combinedFaqs);

        if (combinedFaqs.length > 0) {
          setOpenFaqId(combinedFaqs[0].id);
        }
      } catch (err) {
        setError('Failed to fetch additional FAQs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
    }
  }, [user]);

  // --- Event Handlers (Unchanged) ---
  const handleToggle = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!question.trim()) {
        setFormMessage('Please enter a question.');
        return;
      }
      if (!user) {
        setFormMessage('You must be logged in to ask a question.');
        return;
      }

      try {
        await addDoc(collection(db, 'questions'), {
          question,
          authorId: user.uid,
          authorName: name || user.displayName || 'Anonymous',
          createdAt: serverTimestamp(),
        });
        setQuestion('');
        setFormMessage('Your question has been submitted!');
      } catch (err) {
        console.error("Error submitting question:", err);
        setFormMessage('Failed to submit question. Please try again.');
      }
  };

  return (
    // Root container for background color and minimum height
    <div className="bg-gray-900 dark:bg-black text-white min-h-screen font-sans px-2">
      {/* Main content wrapper.
        - `max-w-7xl`: Constrains width on large screens for readability.
        - `mx-auto`: Centers the content.
        - `py-12 px-4...`: Provides responsive vertical (py) and horizontal (px) padding.
      */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        
        {/*
          Main grid layout.
          - `grid-cols-1`: A single column on mobile (default).
          - `lg:grid-cols-2`: Two columns on large screens and up.
          - `gap-y-10 lg:gap-x-16`: Responsive gap between grid items.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-x-16">
          
          {/* --- Left Column: Frequently Asked Questions --- */}
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {loading && <p>Loading FAQs...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && faqs.map(faq => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="bg-gray-800 rounded-2xl border border-gray-700/50">
                    <button onClick={() => handleToggle(faq.id)} className="w-full flex justify-between items-center text-left p-6 gap-4">
                      <span className="text-lg md:text-xl font-semibold">{faq.question}</span>
                      <div className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-400">
                          {/* The +/- icon lines. The rotation provides a clean animation. */}
                          <div className={`absolute w-4 h-0.5 bg-indigo-400 transition-transform duration-300 ease-out ${isOpen ? 'rotate-0' : 'rotate-90'}`}></div>
                          <div className="absolute w-4 h-0.5 bg-indigo-400 rotate-0"></div>
                      </div>
                    </button>
                    {/* The answer panel with a smooth open/close transition */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                      <p className="px-6 pb-6 text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- Right Column: Still Have Questions Form --- */}
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Still Have Questions?</h2>
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-4 bg-gray-700/50 rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  rows="5"
                  className="w-full p-4 bg-gray-700/50 rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
                >
                  Ask Your Question
                </button>
                {formMessage && <p className="mt-4 text-center text-sm text-gray-400">{formMessage}</p>}
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}