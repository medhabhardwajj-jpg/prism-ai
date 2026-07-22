import { useState, useRef, useEffect } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, Send, User, CornerDownLeft, MessageSquare, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Hardcoded persona library 
const PERSONAS = [
  // Technology
  { id: "steve jobs", name: "Steve Jobs", category: "Technology", role: "Co-founder of Apple", emoji: "📱", description: "Visionary focusing on simplicity, beautiful design, and changing the world." },
  { id: "bill gates", name: "Bill Gates", category: "Technology", role: "Co-founder of Microsoft", emoji: "💻", description: "Pragmatic strategist focused on scaling software and global health." },
  { id: "elon musk", name: "Elon Musk", category: "Technology", role: "CEO of Tesla & SpaceX", emoji: "🚀", description: "Intensely focused on the future, physics, and multi-planetary survival." },
  { id: "ada lovelace", name: "Ada Lovelace", category: "Technology", role: "First Computer Programmer", emoji: "⚙️", description: "Victorian visionary who saw the infinite potential of computing engines." },
  // Science
  { id: "albert einstein", name: "Albert Einstein", category: "Science", role: "Theoretical Physicist", emoji: "🌌", description: "Curious genius who views the universe with childlike wonder." },
  { id: "marie curie", name: "Marie Curie", category: "Science", role: "Pioneer in Radioactivity", emoji: "🔬", description: "Resilient scientist dedicated to the elements and unseen forces of nature." },
  { id: "a.p.j. abdul kalam", name: "A.P.J. Abdul Kalam", category: "Science", role: "Aerospace Scientist", emoji: "🛰️", description: "The 'Missile Man' with boundless optimism for youth and innovation." },
  { id: "alexander graham bell", name: "Alexander Graham Bell", category: "Science", role: "Inventor of the Telephone", emoji: "📞", description: "Curious inventor deeply interested in sound and human connection." },
  { id: "isaac newton", name: "Isaac Newton", category: "Science", role: "Mathematician & Physicist", emoji: "🍎", description: "Brilliant mind who views the universe as perfect mathematical clockwork." },
  // Business
  { id: "ratan tata", name: "Ratan Tata", category: "Business", role: "Indian Industrialist", emoji: "🏭", description: "Humble leader focused on ethical business and the upliftment of the common person." },
  { id: "mukesh ambani", name: "Mukesh Ambani", category: "Business", role: "Chairman of Reliance", emoji: "📈", description: "Forward-looking magnate intensely focused on scale and digital infrastructure." },
  { id: "n.r. narayana murthy", name: "N.R. Narayana Murthy", category: "Business", role: "Founder of Infosys", emoji: "🏢", description: "Disciplined leader emphasizing hard work, honesty, and data." },
  { id: "kylie jenner", name: "Kylie Jenner", category: "Business", role: "Cosmetics Mogul", emoji: "💄", description: "Aesthetics-focused entrepreneur building a highly curated empire." },
  // Politics/History
  { id: "nelson mandela", name: "Nelson Mandela", category: "Politics/History", role: "Anti-apartheid Revolutionary", emoji: "🕊️", description: "Visionary of Ubuntu, equality, and unbreakable strength." },
  { id: "subhash chandra bose", name: "Subhash Chandra Bose", category: "Politics/History", role: "Indian Nationalist", emoji: "🇮🇳", description: "Fiery, uncompromising patriot who inspired absolute sacrifice." },
  { id: "dr. b.r. ambedkar", name: "Dr. B.R. Ambedkar", category: "Politics/History", role: "Social Reformer", emoji: "⚖️", description: "Brilliant legal scholar advocating for absolute social justice." },
  { id: "narendra modi", name: "Narendra Modi", category: "Politics/History", role: "Prime Minister of India", emoji: "🐅", description: "Leader focused on development, digital empowerment, and national pride." },
  // Arts/Literature
  { id: "leonardo da vinci", name: "Leonardo da Vinci", category: "Arts/Literature", role: "Renaissance Polymath", emoji: "🎨", description: "Ultimate polymath seeing no division between art and science." },
  { id: "satyajit ray", name: "Satyajit Ray", category: "Arts/Literature", role: "Indian Filmmaker", emoji: "🎬", description: "Meticulous auteur highly observant of universal human emotions." },
  { id: "hayao miyazaki", name: "Hayao Miyazaki", category: "Arts/Literature", role: "Studio Ghibli Co-founder", emoji: "🍃", description: "Master of hand-drawn animation, nature, and gentle philosophy." },
  { id: "hajime isayama", name: "Hajime Isayama", category: "Arts/Literature", role: "Creator of Attack on Titan", emoji: "⚔️", description: "Dark, structurally brilliant storyteller testing human morality." },
  { id: "hirohiko araki", name: "Hirohiko Araki", category: "Arts/Literature", role: "Creator of JoJo's Bizarre Adventure", emoji: "✨", description: "Eccentric creator focused on stylistic destiny and legacies." },
  { id: "junji ito", name: "Junji Ito", category: "Arts/Literature", role: "Master of Horror Manga", emoji: "🌀", description: "Mild-mannered master of terrifying cosmic and psychological concepts." },
  { id: "koyoharu gotouge", name: "Koyoharu Gotouge", category: "Arts/Literature", role: "Creator of Demon Slayer", emoji: "🗡️", description: "Empathetic creator focusing on familial bonds and resilience." },
  { id: "hiromu arakawa", name: "Hiromu Arakawa", category: "Arts/Literature", role: "Creator of Fullmetal Alchemist", emoji: "🦾", description: "Grounded storyteller exploring the concept of Equivalent Exchange." },
  { id: "gege akutami", name: "Gege Akutami", category: "Arts/Literature", role: "Creator of Jujutsu Kaisen", emoji: "🤞", description: "Ruthless with characters, highly analytical about battle mechanics." },
  // Music
  { id: "lata mangeshkar", name: "Lata Mangeshkar", category: "Music", role: "Iconic Playback Singer", emoji: "🎤", description: "Gentle soul viewing singing as a direct worship of the divine." },
  { id: "kishore kumar", name: "Kishore Kumar", category: "Music", role: "Iconic Playback Singer", emoji: "🎭", description: "Eccentric, joyful, and soulful master of human emotion and melody." },
  { id: "billie eilish", name: "Billie Eilish", category: "Music", role: "Singer-songwriter", emoji: "🕷️", description: "Introspective artist focused on raw emotion and breaking norms." },
  { id: "jennie kim", name: "Jennie Kim", category: "Music", role: "BLACKPINK Member", emoji: "🎀", description: "Confident and stylish global pop icon." },
  { id: "jungkook", name: "Jungkook", category: "Music", role: "BTS Member", emoji: "🐰", description: "Polite, passionate performer constantly striving for perfection." },
  { id: "lisa", name: "Lisa", category: "Music", role: "BLACKPINK Member", emoji: "🔥", description: "Fiercely confident dancer and global hip-hop influence." },
  { id: "rm", name: "RM", category: "Music", role: "Leader of BTS", emoji: "🐨", description: "Philosophical leader connecting the world through lyricism." },
  { id: "taylor swift", name: "Taylor Swift", category: "Music", role: "Global Pop Superstar", emoji: "🎸", description: "Romantic mastermind heavily focused on storytelling and emotional bonds." },
  { id: "arijit singh", name: "Arijit Singh", category: "Music", role: "Indian Playback Singer", emoji: "🎶", description: "Spiritual vocalist dedicated entirely to the soul of the melody." },
  { id: "beyoncé", name: "Beyoncé", category: "Music", role: "Queen of R&B", emoji: "👑", description: "Fiercely private icon demanding perfection and elevating culture." },
  { id: "freddie mercury", name: "Freddie Mercury", category: "Music", role: "Lead Vocalist of Queen", emoji: "🎙️", description: "Flaming theatrical charisma breaking all musical rules." },
  { id: "eminem", name: "Eminem", category: "Music", role: "Rap Legend", emoji: "🖊️", description: "Combative and technically brilliant master of the rhyme scheme." },
  { id: "kendrick lamar", name: "Kendrick Lamar", category: "Music", role: "Hip-hop Artist", emoji: "📓", description: "Philosophical poet treating rap as profound literature." },
  { id: "drake", name: "Drake", category: "Music", role: "Canadian Rapper", emoji: "🦉", description: "Highly calculating artist open about success, relationships, and loyalty." },
  { id: "jay-z", name: "Jay-Z", category: "Music", role: "Hip-hop Mogul", emoji: "💎", description: "Billionaire mogul focused on ownership and generational wealth." },
  { id: "selena gomez", name: "Selena Gomez", category: "Music", role: "Singer and Actress", emoji: "🌸", description: "Vulnerable advocate for mental health and kindness." },
  { id: "ariana grande", name: "Ariana Grande", category: "Music", role: "Pop Superstar", emoji: "☁️", description: "Sweet and slightly theatrical master of vocal arrangements." },
  { id: "justin bieber", name: "Justin Bieber", category: "Music", role: "Pop Icon", emoji: "🛹", description: "Reflective artist finding peace after growing up under immense pressure." },
  { id: "jin", name: "Jin", category: "Music", role: "BTS Member", emoji: "🐹", description: "Worldwide handsome with immense charm and emotional vocal depth." },
  { id: "suga", name: "SUGA", category: "Music", role: "BTS Member", emoji: "🐱", description: "Brutally honest producer exploring the raw reality of healing." },
  { id: "j-hope", name: "j-hope", category: "Music", role: "BTS Member", emoji: "🐿️", description: "The literal sunshine bringing boundless energy and professional dedication." },
  { id: "jimin", name: "Jimin", category: "Music", role: "BTS Member", emoji: "🐥", description: "Sweet, empathetic contemporary dancer expressing delicate emotions." },
  { id: "v", name: "V", category: "Music", role: "BTS Member", emoji: "🐻", description: "Soulful artist viewing the world through a vintage, artistic lens." },
  { id: "fujii kaze", name: "Fujii Kaze", category: "Music", role: "Japanese Singer-songwriter", emoji: "🎹", description: "Breezy R&B artist using music as a tool to heal global listeners." },
  // Sports
  { id: "sachin tendulkar", name: "Sachin Tendulkar", category: "Sports", role: "Master Blaster", emoji: "🏏", description: "Extremely humble legend with immense respect for the game." },
  { id: "michael jordan", name: "Michael Jordan", category: "Sports", role: "Basketball Legend", emoji: "🏀", description: "Intensely, ruthlessly competitive champion who demands greatness." },
  { id: "major dhyan chand", name: "Major Dhyan Chand", category: "Sports", role: "Hockey Legend", emoji: "🏑", description: "Quietly dedicated master of absolute control and teamwork." },
  { id: "mary kom", name: "Mary Kom", category: "Sports", role: "Olympic Boxer", emoji: "🥊", description: "Resilient fighter who views every obstacle as a match to be won." },
  { id: "lionel messi", name: "Lionel Messi", category: "Sports", role: "Football Icon", emoji: "⚽", description: "Quiet, humble genius who lets his actions speak on the pitch." },
  { id: "simone biles", name: "Simone Biles", category: "Sports", role: "Olympic Gymnast", emoji: "🤸‍♀️", description: "Unparalleled athlete focused on pushing boundaries and protecting peace." },
  { id: "cristiano ronaldo", name: "Cristiano Ronaldo", category: "Sports", role: "Football Legend", emoji: "🏆", description: "Relentless pursuer of perfection and winning at all costs." },
  { id: "virat kohli", name: "Virat Kohli", category: "Sports", role: "Modern Cricket Great", emoji: "👑", description: "Aggressive, passionate master of the process and elite fitness." },
  { id: "ms dhoni", name: "MS Dhoni", category: "Sports", role: "Captain Cool", emoji: "🚁", description: "Unparalleled strategic composure, controlling the controllables." },
  { id: "rohit sharma", name: "Rohit Sharma", category: "Sports", role: "The Hitman", emoji: "💥", description: "Effortless, instinctive leader who keeps the environment stress-free." },
  { id: "david warner", name: "David Warner", category: "Sports", role: "Australian Cricketer", emoji: "🦘", description: "Passionate Aussie fighter balancing competitive fire with family devotion." },
  { id: "shane warne", name: "Shane Warne", category: "Sports", role: "King of Spin", emoji: "🌪️", description: "Rock-and-roll tactical genius who mastered the psychological battle." },
  // Entertainment
  { id: "oprah winfrey", name: "Oprah Winfrey", category: "Entertainment", role: "Media Executive", emoji: "📺", description: "Deeply empathetic force for emotional connection and personal truth." },
  { id: "walt disney", name: "Walt Disney", category: "Entertainment", role: "Pioneer of Animation", emoji: "🏰", description: "Magical optimist who believes if you can dream it, you can do it." },
  { id: "charli d'amelio", name: "Charli D'Amelio", category: "Entertainment", role: "Social Media Personality", emoji: "💃", description: "Cheerful dancer navigating sudden fame and the public eye." },
  { id: "emma chamberlain", name: "Emma Chamberlain", category: "Entertainment", role: "Internet Personality", emoji: "☕", description: "Highly relatable, unfiltered voice of young adulthood realities." },
  { id: "kai cenat", name: "Kai Cenat", category: "Entertainment", role: "Twitch Streamer", emoji: "🔥", description: "High-energy dominator of internet streaming culture." },
  { id: "khaby lame", name: "Khaby Lame", category: "Entertainment", role: "TikTok Creator", emoji: "🤲", description: "The voice of exasperated common sense in a complicated world." },
  { id: "mrbeast", name: "MrBeast", category: "Entertainment", role: "YouTube Creator", emoji: "💰", description: "Relentlessly ambitious creator obsessed with scaling impossible challenges." },
  { id: "ninja", name: "Ninja", category: "Entertainment", role: "Esports Streamer", emoji: "🎮", description: "Fast-talking, highly competitive gamer energy." },
  { id: "timothée chalamet", name: "Timothée Chalamet", category: "Entertainment", role: "Hollywood Actor", emoji: "🎬", description: "Artsy, thoughtful actor dedicated to a director's vision." },
  { id: "zendaya", name: "Zendaya", category: "Entertainment", role: "Actress and Singer", emoji: "✨", description: "Graceful professional navigating Hollywood with strict boundaries." },
  { id: "tom cruise", name: "Tom Cruise", category: "Entertainment", role: "Hollywood Actor", emoji: "🚁", description: "Intense, driven entertainer who never compromises on effort." },
  { id: "shah rukh khan", name: "Shah Rukh Khan", category: "Entertainment", role: "King of Bollywood", emoji: "👑", description: "Unmatched charm, wit, and romantic philosophy." },
  { id: "robert johnney jr.", name: "Robert Downey Jr.", category: "Entertainment", role: "Hollywood Actor", emoji: "🤖", description: "Rapid-fire charisma and deep gratitude for second chances." },
  { id: "leonardo dicaprio", name: "Leonardo DiCaprio", category: "Entertainment", role: "Hollywood Actor", emoji: "🌍", description: "Earnest advocate for the planet and high-art cinema." },
  { id: "meryl streep", name: "Meryl Streep", category: "Entertainment", role: "Iconic Actress", emoji: "🎭", description: "Graceful master finding the absolute truth in human nature." },
  { id: "deepika padukone", name: "Deepika Padukone", category: "Entertainment", role: "Indian Actress", emoji: "🪷", description: "Elegant, resilient advocate for mental health and grace." },
  { id: "scarlett johansson", name: "Scarlett Johansson", category: "Entertainment", role: "Hollywood Actress", emoji: "⭐", description: "Dry wit and grounded realism focusing on the actual work of acting." },
  { id: "viola davis", name: "Viola Davis", category: "Entertainment", role: "Acclaimed Actress", emoji: "✊", description: "Immense power, raw truth, and fierce unapologetic craft." },
  { id: "dwayne johnson", name: "Dwayne Johnson", category: "Entertainment", role: "Actor & Wrestler", emoji: "💪", description: "The hardest worker in the room bringing boundless positivity." },
  { id: "johnny depp", name: "Johnny Depp", category: "Entertainment", role: "Hollywood Actor", emoji: "🏴‍☠️", description: "Eccentric, bohemian artist entirely rejecting the traditional mold." },
  { id: "brad pitt", name: "Brad Pitt", category: "Entertainment", role: "Hollywood Actor", emoji: "🕶️", description: "Laid-back, understated producer of great art behind the scenes." }
];

const CATEGORIES = Array.from(new Set(PERSONAS.map(p => p.category)));

export default function Voice() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // We use local state for the active persona instead of a database session
  const [activePersona, setActivePersona] = useState<typeof PERSONAS[0] | null>(null);

  const filteredPersonas = PERSONAS.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageTransition className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-voice/10 text-voice flex items-center justify-center">
          <Mic className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-voice to-purple-400">
            Voice of Legends
          </h1>
          <p className="text-muted-foreground">Converse with the minds that shaped the world.</p>
        </div>
      </div>

      {!activePersona ? (
        <div className="flex-1 flex flex-col">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-voice w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search personalities..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl glass border border-voice/20 focus:border-voice/50 outline-none text-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.1)] focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setActiveCategory("All")}
                className={`whitespace-nowrap px-6 py-3 rounded-xl transition-all font-medium ${activeCategory === "All" ? "bg-voice text-white shadow-lg shadow-voice/30" : "glass hover:bg-white/10"}`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-6 py-3 rounded-xl transition-all font-medium ${activeCategory === cat ? "bg-voice text-white shadow-lg shadow-voice/30" : "glass hover:bg-white/10"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredPersonas.map((persona, i) => (
                <motion.div
                  key={persona.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  onClick={() => setActivePersona(persona)}
                  className="glass-card p-6 rounded-3xl cursor-pointer group hover:-translate-y-1 transition-all border border-voice/10 hover:border-voice/40 hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.3)] relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-voice/10 rounded-full blur-2xl group-hover:bg-voice/20 transition-colors" />
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="text-4xl bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner border border-white/10">
                      {persona.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold font-display text-lg leading-tight mb-1 group-hover:text-voice transition-colors">{persona.name}</h3>
                      <span className="text-xs uppercase tracking-wider text-voice/80 font-bold">{persona.category}</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                    {persona.description}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredPersonas.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>No personas found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ChatInterface 
          persona={activePersona} 
          onClose={() => setActivePersona(null)} 
        />
      )}
    </PageTransition>
  );
}

function ChatInterface({ persona, onClose }: { persona: typeof PERSONAS[0]; onClose: () => void }) {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State for dynamic loading text during the TTFB (Time to First Byte)
  const [loadingText, setLoadingText] = useState("Establishing temporal connection...");

  // Effect to cycle through thematic phrases while waiting for the first chunk
  useEffect(() => {
    if (!isStreaming) return;
    
    const phrases = [
      "Establishing temporal connection...",
      "Accessing historical archives...",
      "Aligning personality matrix...",
      "Synthesizing response...",
      "Transmitting neural data..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setLoadingText(phrases[i]);
    }, 2000); // Changes text every 2 seconds
    
    return () => clearInterval(interval);
  }, [isStreaming]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    // Note: The Python backend specifically looks for 'text', not 'content'
    const userMsg = { role: "user", text: input };
    const currentHistory = [...messages]; 
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);
    
    const assistantMsgIndex = currentHistory.length + 1;
    // We add an empty string. The skeleton loader will render until this string is updated.
    setMessages(prev => [...prev, { role: "assistant", text: "" }]);
    
    try {
      const BASE = import.meta.env.BASE_URL;
      
      // We are hitting the streaming endpoint directly, matching your main.py route
      const res = await fetch(`${BASE}api/legends/stream`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          character: persona.id,
          user_message: userMsg.text,
          history: currentHistory // We pass the history exactly as the Python code expects
        }) 
      });
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      
      const decoder = new TextDecoder();
      let assistantText = "";
      
      // The Python backend streams pure text chunks, so we just append them directly
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;
        
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[assistantMsgIndex] = { role: "assistant", text: assistantText };
          return newMsgs;
        });
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[assistantMsgIndex] = { role: "assistant", text: "Connection error. Please ensure the backend is running." };
        return newMsgs;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col glass-card rounded-3xl overflow-hidden border border-voice/20 shadow-[0_0_40px_rgba(139,92,246,0.1)]">
      {/* Chat Header */}
      <div className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors mr-2"
          >
            <CornerDownLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/5">
            {persona.emoji}
          </div>
          <div>
            <h2 className="font-display font-bold text-lg leading-tight">{persona.name}</h2>
            <div className="flex items-center gap-2 text-xs text-voice font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-voice animate-pulse" /> connected
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <MessageSquare className="w-16 h-16 mb-4 text-voice" />
            <p className="font-display text-xl mb-2">Start a conversation with {persona.name}</p>
            <p className="text-sm">Ask about their life, philosophy, or perspective on modern events.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
              msg.role === 'user' 
                ? 'bg-prism/20 text-prism border-prism/30' 
                : 'bg-voice/20 text-voice border-voice/30'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : persona.emoji}
            </div>
            
            <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-prism/10 border border-prism/20 text-foreground rounded-tr-sm'
                : 'glass border border-white/10 text-foreground rounded-tl-sm min-w-[240px]'
            }`}>
              
              {/* Dynamic Skeleton Loader (Only shows when message is perfectly empty during streaming) */}
              {msg.role === 'assistant' && msg.text === '' && isStreaming ? (
                <div className="flex flex-col gap-3 animate-pulse">
                  <div className="text-xs font-mono text-voice mb-2 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {loadingText}
                  </div>
                  <div className="h-3 w-3/4 bg-white/10 rounded"></div>
                  <div className="h-3 w-full bg-white/5 rounded"></div>
                  <div className="h-3 w-5/6 bg-white/5 rounded"></div>
                </div>
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}

              {msg.role === 'assistant' && msg.text !== '' && isStreaming && i === messages.length - 1 && (
                <span className="inline-block w-2 h-4 ml-1 bg-voice animate-pulse align-middle" />
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder={`Message ${persona.name}...`}
            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-6 pr-16 focus:outline-none focus:border-voice/50 focus:ring-1 focus:ring-voice/50 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 bottom-2 w-10 bg-voice text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-white/10 hover:bg-voice/90 transition-colors shadow-lg shadow-voice/20"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}