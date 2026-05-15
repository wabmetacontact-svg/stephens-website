import { useRef, useState, useEffect } from "react";

function useReveal(t = 0.06) {
    const ref = useRef<HTMLDivElement>(null);
    const [v, setV] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
            { threshold: t }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [t]);
    return { ref, v };
}

// ✅ BLOG POSTS DATA — Yahan apne articles add karo
const blogPosts = [
    {
        id: 1,
        title: "The future of digital banking in a post-SVB world",
        excerpt: "How community banks can navigate the evolving regulatory landscape and leverage digital transformation to build resilience and growth in an era of unprecedented change.",
        category: "Digital Banking",
        date: "Mar 15, 2025",
        readTime: "8 min read",
        image: "/images/blog/digital-banking.jpg",
        featured: true,
        tags: ["Banking", "Regulation", "Digital"],
    },
    {
        id: 2,
        title: "Blockchain and stablecoins: Opportunities for traditional banks",
        excerpt: "Exploring how established financial institutions can integrate blockchain technology and digital assets into their existing operations without compromising regulatory compliance.",
        category: "Blockchain",
        date: "Feb 28, 2025",
        readTime: "6 min read",
        image: "/images/blog/blockchain.jpg",
        featured: false,
        tags: ["Blockchain", "Crypto", "Innovation"],
    },
    {
        id: 3,
        title: "M&A strategies for community banks in 2025",
        excerpt: "A practical guide to acquisition strategies, valuation methods, and integration playbooks that drive successful community bank transactions.",
        category: "M&A",
        date: "Feb 10, 2025",
        readTime: "10 min read",
        image: "/images/blog/ma-strategy.jpg",
        featured: false,
        tags: ["M&A", "Strategy", "Growth"],
    },
    {
        id: 4,
        title: "AI in financial services: Beyond the hype",
        excerpt: "Cutting through the noise to identify practical AI applications that deliver real value for banks, from credit risk assessment to customer experience optimization.",
        category: "Technology",
        date: "Jan 22, 2025",
        readTime: "7 min read",
        image: "/images/blog/ai-finance.jpg",
        featured: false,
        tags: ["AI", "Technology", "Innovation"],
    },
    {
        id: 5,
        title: "Building resilient governance in turbulent times",
        excerpt: "Lessons from decades of board experience on structuring governance frameworks that protect institutions while enabling bold strategic moves.",
        category: "Governance",
        date: "Jan 5, 2025",
        readTime: "5 min read",
        image: "/images/blog/governance.jpg",
        featured: false,
        tags: ["Governance", "Leadership", "Risk"],
    },
    {
        id: 6,
        title: "The turnaround playbook: Transforming distressed banks",
        excerpt: "A step-by-step framework for diagnosing institutional challenges, restructuring operations, and driving sustainable recovery in banking.",
        category: "Turnaround",
        date: "Dec 18, 2024",
        readTime: "9 min read",
        image: "/images/blog/turnaround.jpg",
        featured: false,
        tags: ["Turnaround", "Operations", "Strategy"],
    },
];

// Category colors
const categoryColors: Record<string, string> = {
    "Digital Banking": "#4b1e78",
    "Blockchain": "#55288d",
    "M&A": "#512383",
    "Technology": "#5a2d8a",
    "Governance": "#4b1e78",
    "Turnaround": "#512383",
};

export default function BlogSection() {
    const { ref: sRef, v: sV } = useReveal(.04);
    const [activeFilter, setActiveFilter] = useState("All");
    const [hoveredPost, setHoveredPost] = useState<number | null>(null);

    const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.category)))];

    const filteredPosts = activeFilter === "All"
        ? blogPosts
        : blogPosts.filter(p => p.category === activeFilter);

    const featuredPost = blogPosts.find(p => p.featured);
    const regularPosts = filteredPosts.filter(p => !p.featured || activeFilter !== "All");

    return (
        <section id="blog" ref={sRef} style={{
            background: "var(--bg)",
            padding: "clamp(80px,12vh,140px) clamp(24px,6vw,96px)",
            position: "relative",
            overflow: "hidden",
            borderTop: "1px solid var(--border)",
        }}>
            {/* ═══ HEADER ═══ */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "clamp(24px,4vh,40px)",
                opacity: sV ? 1 : 0,
                transform: sV ? "translateY(0)" : "translateY(16px)",
                transition: "opacity .8s ease, transform .8s ease",
            }}>
                <div style={{
                    width: "32px", height: "2px",
                    background: "var(--primary)", borderRadius: "1px",
                    transform: sV ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform .8s ease .2s",
                }} />
                <span className="section-tag">Insights</span>
            </div>

            {/* Title + View All */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: "clamp(32px,5vh,48px)",
            }}>
                <div>
                    <h2 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "clamp(36px,5vw,48px)",
                        fontWeight: 700,
                        lineHeight: 1.15,
                        color: "var(--headline)",
                        marginBottom: "12px",
                        opacity: sV ? 1 : 0,
                        transform: sV ? "translateY(0)" : "translateY(24px)",
                        transition: "opacity .8s ease .1s, transform .8s ease .1s",
                    }}>
                        Articles & insights
                    </h2>
                    <p style={{
                        fontSize: "17px",
                        color: "var(--muted)",
                        maxWidth: "480px",
                        lineHeight: 1.6,
                        opacity: sV ? 1 : 0,
                        transition: "opacity .8s ease .2s",
                    }}>
                        Perspectives on banking, fintech, M&A, and executive leadership.
                    </p>
                </div>

                <a href="#" className="btn btn-outline" style={{
                    opacity: sV ? 1 : 0,
                    transition: "opacity .8s ease .3s",
                }}>
                    View all articles →
                </a>
            </div>

            {/* ═══ CATEGORY FILTERS ═══ */}
            <div style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "clamp(36px,5vh,56px)",
                opacity: sV ? 1 : 0,
                transform: sV ? "translateY(0)" : "translateY(16px)",
                transition: "opacity .8s ease .2s, transform .8s ease .2s",
            }}>
                {categories.map((cat, i) => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        style={{
                            fontSize: "13px",
                            fontWeight: activeFilter === cat ? 600 : 500,
                            color: activeFilter === cat ? "#FFFFFF" : "var(--body)",
                            background: activeFilter === cat ? "var(--primary)" : "var(--bg-card)",
                            border: `1px solid ${activeFilter === cat ? "var(--primary)" : "var(--border)"}`,
                            padding: "8px 20px",
                            borderRadius: "100px",
                            cursor: "pointer",
                            transition: "all .3s ease",
                            boxShadow: activeFilter === cat ? "var(--shadow-md)" : "var(--shadow-sm)",
                            opacity: sV ? 1 : 0,
                            transform: sV ? "translateY(0)" : "translateY(8px)",
                            transitionDelay: `${0.25 + i * 0.04}s`,
                        }}
                        onMouseEnter={e => {
                            if (activeFilter !== cat) {
                                e.currentTarget.style.borderColor = "var(--primary)";
                                e.currentTarget.style.color = "var(--primary)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }
                        }}
                        onMouseLeave={e => {
                            if (activeFilter !== cat) {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.color = "var(--body)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ═══ FEATURED POST (only when "All" filter) ═══ */}
            {activeFilter === "All" && featuredPost && (
                <FeaturedBlogCard
                    post={featuredPost}
                    isVisible={sV}
                    isHovered={hoveredPost === featuredPost.id}
                    onHover={setHoveredPost}
                />
            )}

            {/* ═══ BLOG GRID ═══ */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
                marginTop: activeFilter === "All" ? "32px" : "0",
            }} className="blog-grid">
                {(activeFilter === "All" ? regularPosts.filter(p => !p.featured) : regularPosts).map((post, i) => (
                    <BlogCard
                        key={post.id}
                        post={post}
                        index={i}
                        isVisible={sV}
                        isHovered={hoveredPost === post.id}
                        onHover={setHoveredPost}
                    />
                ))}
            </div>

            <style>{`
        @media(max-width:900px){
          .blog-grid{grid-template-columns:repeat(2,1fr)!important;}
        }
        @media(max-width:600px){
          .blog-grid{grid-template-columns:1fr!important;}
          .featured-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════
// FEATURED BLOG CARD
// ═══════════════════════════════════════════════════════════
function FeaturedBlogCard({ post, isVisible, isHovered, onHover }: {
    post: typeof blogPosts[0];
    isVisible: boolean;
    isHovered: boolean;
    onHover: (id: number | null) => void;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D tilt
    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        const onMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
            card.style.transform = `perspective(1200px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateZ(8px)`;
        };
        const onLeave = () => {
            card.style.transform = "perspective(1200px) rotateX(0) rotateY(0) translateZ(0)";
            setMousePos({ x: 0.5, y: 0.5 });
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        return () => { card.removeEventListener("mousemove", onMove); card.removeEventListener("mouseleave", onLeave); };
    }, []);

    return (
        <a href="#" style={{ textDecoration: "none" }}
            onMouseEnter={() => onHover(post.id)}
            onMouseLeave={() => onHover(null)}
        >
            <div
                ref={cardRef}
                className="card"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    overflow: "hidden",
                    borderColor: isHovered ? "var(--primary)" : "var(--border)",
                    boxShadow: isHovered ? "var(--shadow-xl)" : "var(--shadow-md)",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(32px)",
                    transition: "opacity .8s ease .3s, transform .8s ease .3s, border-color .3s ease, box-shadow .4s ease",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                }}
            >
                {/* Image */}
                <div style={{
                    position: "relative",
                    minHeight: "320px",
                    overflow: "hidden",
                }}>
                    <img
                        src={post.image}
                        alt={post.title}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        style={{
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            opacity: imageLoaded ? 1 : 0,
                            transition: "opacity .5s ease, transform .4s ease",
                            transform: isHovered ? `scale(1.05) translate(${(mousePos.x - 0.5) * -6}px, ${(mousePos.y - 0.5) * -6}px)` : "scale(1)",
                        }}
                    />

                    {/* Placeholder */}
                    {!imageLoaded && (
                        <BlogImagePlaceholder category={post.category} />
                    )}

                    {/* Overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(135deg, rgba(75,30,120,0.08) 0%, transparent 100%)",
                        pointerEvents: "none",
                    }} />

                    {/* Featured badge */}
                    <div style={{
                        position: "absolute", top: "16px", left: "16px",
                        background: "var(--primary)",
                        color: "#FFFFFF",
                        fontSize: "11px", fontWeight: 700,
                        letterSpacing: ".1em", textTransform: "uppercase",
                        padding: "6px 14px", borderRadius: "6px",
                        boxShadow: "0 2px 12px rgba(75,30,120,0.3)",
                    }}>
                        Featured
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    padding: "clamp(28px,4vw,44px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                    {/* Category + Date */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px",
                    }}>
                        <span style={{
                            fontSize: "11px", fontWeight: 600,
                            letterSpacing: ".12em", textTransform: "uppercase",
                            color: "var(--primary)",
                            background: "var(--primary-05)",
                            padding: "4px 12px", borderRadius: "6px",
                        }}>{post.category}</span>
                        <span style={{ fontSize: "13px", color: "var(--muted)" }}>{post.date}</span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "clamp(24px,3vw,32px)",
                        fontWeight: 700,
                        color: isHovered ? "var(--primary)" : "var(--headline)",
                        lineHeight: 1.25,
                        marginBottom: "16px",
                        transition: "color .3s ease",
                    }}>{post.title}</h3>

                    {/* Excerpt */}
                    <p style={{
                        fontSize: "16px",
                        lineHeight: 1.7,
                        color: "var(--body)",
                        marginBottom: "24px",
                    }}>{post.excerpt}</p>

                    {/* Tags */}
                    <div style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginBottom: "24px",
                    }}>
                        {post.tags.map(tag => (
                            <span key={tag} style={{
                                fontSize: "11px", fontWeight: 500,
                                color: "var(--muted)",
                                background: "var(--bg-section)",
                                padding: "4px 10px", borderRadius: "6px",
                                border: "1px solid var(--border)",
                            }}>{tag}</span>
                        ))}
                    </div>

                    {/* Read more */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--primary)",
                            transition: "gap .3s ease",
                        }}>
                            Read article
                            <span style={{
                                transition: "transform .3s ease",
                                transform: isHovered ? "translateX(4px)" : "translateX(0)",
                                display: "inline-block",
                            }}>→</span>
                        </div>
                        <span style={{
                            fontSize: "12px", color: "var(--muted)", fontWeight: 500,
                        }}>{post.readTime}</span>
                    </div>
                </div>
            </div>
        </a>
    );
}

// ═══════════════════════════════════════════════════════════
// BLOG CARD
// ═══════════════════════════════════════════════════════════
function BlogCard({ post, index, isVisible, isHovered, onHover }: {
    post: typeof blogPosts[0];
    index: number;
    isVisible: boolean;
    isHovered: boolean;
    onHover: (id: number | null) => void;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const delay = 0.35 + index * 0.1;

    return (
        <a href="#" style={{ textDecoration: "none" }}
            onMouseEnter={() => onHover(post.id)}
            onMouseLeave={() => onHover(null)}
        >
            <div
                className="card"
                style={{
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderColor: isHovered ? "var(--primary)" : "var(--border)",
                    boxShadow: isHovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
                    transform: isHovered
                        ? "translateY(-6px)"
                        : (isVisible ? "translateY(0)" : "translateY(32px)"),
                    opacity: isVisible ? 1 : 0,
                    transition: `
            opacity .7s ease ${delay}s,
            transform .7s cubic-bezier(.16,1,.3,1) ${delay}s,
            border-color .3s ease,
            box-shadow .4s ease
          `,
                }}
            >
                {/* Image */}
                <div style={{
                    position: "relative",
                    height: "200px",
                    overflow: "hidden",
                }}>
                    <img
                        src={post.image}
                        alt={post.title}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        style={{
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            opacity: imageLoaded ? 1 : 0,
                            transition: "opacity .5s ease, transform .5s ease",
                            transform: isHovered ? "scale(1.06)" : "scale(1)",
                        }}
                    />

                    {/* Placeholder */}
                    {!imageLoaded && (
                        <BlogImagePlaceholder category={post.category} />
                    )}

                    {/* Top gradient */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.05) 100%)",
                        pointerEvents: "none",
                    }} />

                    {/* Category badge on image */}
                    <div style={{
                        position: "absolute",
                        top: "12px", left: "12px",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(8px)",
                        fontSize: "10px", fontWeight: 700,
                        letterSpacing: ".1em", textTransform: "uppercase",
                        color: categoryColors[post.category] || "var(--primary)",
                        padding: "5px 12px", borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}>
                        {post.category}
                    </div>

                    {/* Read time badge */}
                    <div style={{
                        position: "absolute",
                        top: "12px", right: "12px",
                        background: "rgba(255,255,255,0.9)",
                        fontSize: "10px", fontWeight: 600,
                        color: "var(--muted)",
                        padding: "4px 10px", borderRadius: "6px",
                    }}>
                        {post.readTime}
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                }}>
                    {/* Date */}
                    <span style={{
                        fontSize: "12px", fontWeight: 500,
                        color: "var(--muted)",
                        marginBottom: "12px",
                    }}>{post.date}</span>

                    {/* Title */}
                    <h3 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "clamp(18px,2vw,22px)",
                        fontWeight: 600,
                        color: isHovered ? "var(--primary)" : "var(--headline)",
                        lineHeight: 1.3,
                        marginBottom: "12px",
                        transition: "color .3s ease",
                        flex: 0,
                    }}>{post.title}</h3>

                    {/* Excerpt */}
                    <p style={{
                        fontSize: "14px",
                        lineHeight: 1.65,
                        color: "var(--muted)",
                        marginBottom: "20px",
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}>{post.excerpt}</p>

                    {/* Tags */}
                    <div style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginBottom: "16px",
                    }}>
                        {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} style={{
                                fontSize: "10px", fontWeight: 500,
                                color: "var(--muted)",
                                background: "var(--bg-section)",
                                padding: "3px 8px", borderRadius: "4px",
                                border: "1px solid var(--border)",
                            }}>{tag}</span>
                        ))}
                    </div>

                    {/* Read more */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--primary)",
                        marginTop: "auto",
                    }}>
                        Read more
                        <span style={{
                            transition: "transform .3s ease",
                            transform: isHovered ? "translateX(4px)" : "translateX(0)",
                            display: "inline-block",
                        }}>→</span>
                    </div>
                </div>
            </div>
        </a>
    );
}

// ═══════════════════════════════════════════════════════════
// BLOG IMAGE PLACEHOLDER
// ═══════════════════════════════════════════════════════════
function BlogImagePlaceholder({ category }: { category: string }) {
    const gradients: Record<string, string> = {
        "Digital Banking": "linear-gradient(135deg, #4b1e78 0%, #55288d 100%)",
        "Blockchain": "linear-gradient(135deg, #512383 0%, #5a2d8a 100%)",
        "M&A": "linear-gradient(135deg, #4b1e78 0%, #512383 100%)",
        "Technology": "linear-gradient(135deg, #55288d 0%, #5a2d8a 100%)",
        "Governance": "linear-gradient(135deg, #4b1e78 0%, #55288d 100%)",
        "Turnaround": "linear-gradient(135deg, #512383 0%, #4b1e78 100%)",
    };

    const icons: Record<string, string> = {
        "Digital Banking": "◎",
        "Blockchain": "⬡",
        "M&A": "◆",
        "Technology": "◈",
        "Governance": "□",
        "Turnaround": "○",
    };

    return (
        <div style={{
            position: "absolute", inset: 0,
            background: gradients[category] || gradients["Digital Banking"],
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {/* Dot pattern */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }} />

            {/* Icon */}
            <span style={{
                fontSize: "48px",
                color: "rgba(255,255,255,0.15)",
                marginBottom: "8px",
            }}>{icons[category] || "◎"}</span>

            {/* Category text */}
            <span style={{
                fontSize: "11px", fontWeight: 600,
                letterSpacing: ".15em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
            }}>{category}</span>
        </div>
    );
}