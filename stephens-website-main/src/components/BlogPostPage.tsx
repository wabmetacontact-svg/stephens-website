import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogPosts, categoryColors } from "../data/blogPosts";

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const post = blogPosts.find(p => p.slug === slug);
    const [progress, setProgress] = useState(0);
    const [showToc, setShowToc] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const articleRef = useRef<HTMLDivElement>(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Reading progress bar
    useEffect(() => {
        const handleScroll = () => {
            const article = articleRef.current;
            if (!article) return;
            const totalHeight = article.offsetHeight;
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const articleTop = article.offsetTop;
            const scrolled = Math.max(0, scrollTop - articleTop + windowHeight * 0.3);
            const pct = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
            setProgress(pct);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [slug]);

    // Track active section for TOC
    useEffect(() => {
        const headings = document.querySelectorAll("[data-heading]");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -70% 0px" }
        );
        headings.forEach(h => observer.observe(h));
        return () => observer.disconnect();
    }, [slug]);

    // 404
    if (!post) {
        return (
            <section style={{
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg)",
                padding: "120px 24px",
                textAlign: "center",
            }}>
                <div style={{
                    fontSize: "72px", marginBottom: "16px", opacity: 0.3,
                }}>404</div>
                <h1 style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: "clamp(32px,4vw,48px)",
                    color: "var(--headline)",
                    marginBottom: "16px",
                }}>Article Not Found</h1>
                <p style={{ color: "var(--muted)", marginBottom: "32px", fontSize: "16px" }}>
                    The article you're looking for doesn't exist.
                </p>
                <Link to="/" className="btn btn-primary">← Back to Home</Link>
            </section>
        );
    }

    // Related posts
    const relatedPosts = blogPosts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    // Generate TOC from headings
    const tocItems = post.content
        .map((block, i) => ({ block, i }))
        .filter(({ block }) => block.type === "heading")
        .map(({ block, i }) => ({
            id: `section-${i}`,
            text: (block as { type: "heading"; text: string }).text,
        }));

    // Share handlers
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const handleShare = (platform: string) => {
        const text = encodeURIComponent(post.title);
        const url = encodeURIComponent(shareUrl);
        const links: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        };
        if (platform === "copy") {
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied!");
            return;
        }
        window.open(links[platform], "_blank", "noopener,noreferrer");
    };

    return (
        <>
            {/* ═══ READING PROGRESS BAR ═══ */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "transparent",
                zIndex: 9999,
                pointerEvents: "none",
            }}>
                <div style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, var(--primary), #8b4dd4)",
                    transition: "width 0.1s ease",
                    boxShadow: "0 0 10px rgba(75,30,120,0.5)",
                }} />
            </div>

            <article ref={articleRef} style={{
                background: "var(--bg)",
                minHeight: "100vh",
                paddingTop: "100px",
                position: "relative",
            }}>
                {/* ═══ TOP BAR ═══ */}
                <div style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "clamp(20px,3vh,32px) clamp(24px,6vw,80px) 0",
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="back-btn"
                        style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: "var(--body)",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: "pointer",
                            padding: "8px 16px",
                            borderRadius: "100px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all .3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary)";
                            e.currentTarget.style.color = "var(--primary)";
                            e.currentTarget.style.background = "var(--primary-05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.color = "var(--body)";
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <span style={{ fontSize: "16px" }}>←</span> Back
                    </button>
                </div>

                {/* ═══ HERO HEADER ═══ */}
                <header className="article-hero" style={{
                    padding: "clamp(40px,6vh,72px) clamp(24px,6vw,80px) clamp(32px,4vh,48px)",
                    maxWidth: "860px",
                    margin: "0 auto",
                    textAlign: "center",
                    animation: "fadeInUp 0.8s ease",
                }}>
                    {/* Category badge */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: ".15em",
                        textTransform: "uppercase",
                        color: categoryColors[post.category] || "var(--primary)",
                        background: "var(--primary-05)",
                        padding: "8px 18px",
                        borderRadius: "100px",
                        marginBottom: "32px",
                        border: `1px solid ${categoryColors[post.category] || "var(--primary)"}33`,
                    }}>
                        <span style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: categoryColors[post.category] || "var(--primary)",
                        }} />
                        {post.category}
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "clamp(32px,5.5vw,60px)",
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: "var(--headline)",
                        marginBottom: "28px",
                        letterSpacing: "-0.025em",
                    }}>
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    <p style={{
                        fontSize: "clamp(17px,1.6vw,21px)",
                        lineHeight: 1.55,
                        color: "var(--muted)",
                        marginBottom: "40px",
                        fontWeight: 400,
                        maxWidth: "720px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}>
                        {post.excerpt}
                    </p>

                    {/* Meta info */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        padding: "20px 28px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        boxShadow: "var(--shadow-sm)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, var(--primary), #8b4dd4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFFFFF",
                                fontWeight: 700,
                                fontSize: "15px",
                                boxShadow: "0 4px 12px rgba(75,30,120,0.3)",
                            }}>SC</div>
                            <div style={{ textAlign: "left" }}>
                                <div style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "var(--headline)",
                                    lineHeight: 1.2,
                                }}>Stephen K. Curry</div>
                                <div style={{
                                    fontSize: "12px",
                                    color: "var(--muted)",
                                    marginTop: "2px",
                                }}>Founder, Endurance Advisory</div>
                            </div>
                        </div>

                        <div style={{
                            width: "1px",
                            height: "32px",
                            background: "var(--border)",
                        }} />

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            fontSize: "13px",
                            color: "var(--muted)",
                            fontWeight: 500,
                        }}>
                            <span>📅 {post.date}</span>
                            <span>•</span>
                            <span>⏱ {post.readTime}</span>
                        </div>
                    </div>
                </header>

                {/* ═══ HERO IMAGE ═══ */}
                <div style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "0 clamp(24px,6vw,80px)",
                    marginBottom: "clamp(48px,7vh,80px)",
                    animation: "fadeIn 1s ease 0.2s both",
                }}>
                    <div style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        overflow: "hidden",
                        borderRadius: "20px",
                        boxShadow: "0 30px 80px -20px rgba(75,30,120,0.35)",
                        background: "var(--bg-section)",
                        position: "relative",
                    }}>
                        <img
                            src={post.image}
                            alt={post.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(180deg, transparent 70%, rgba(0,0,0,0.15))",
                            pointerEvents: "none",
                        }} />
                    </div>
                </div>

                {/* ═══ MAIN CONTENT WRAPPER (with sidebar) ═══ */}
                <div className="article-layout" style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "0 clamp(24px,6vw,80px) clamp(60px,8vh,100px)",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 700px) minmax(0, 1fr)",
                    gap: "40px",
                    position: "relative",
                }}>
                    {/* ═══ LEFT: SHARE BUTTONS ═══ */}
                    <aside className="share-sidebar" style={{
                        position: "relative",
                    }}>
                        <div style={{
                            position: "sticky",
                            top: "120px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            alignItems: "flex-end",
                        }}>
                            <div style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                letterSpacing: ".15em",
                                textTransform: "uppercase",
                                color: "var(--muted)",
                                marginBottom: "4px",
                                writingMode: "vertical-rl",
                                transform: "rotate(180deg)",
                                paddingBottom: "8px",
                            }}>Share</div>
                            <ShareButton icon="𝕏" label="Twitter" onClick={() => handleShare("twitter")} />
                            <ShareButton icon="in" label="LinkedIn" onClick={() => handleShare("linkedin")} />
                            <ShareButton icon="f" label="Facebook" onClick={() => handleShare("facebook")} />
                            <ShareButton icon="🔗" label="Copy link" onClick={() => handleShare("copy")} />
                        </div>
                    </aside>

                    {/* ═══ CENTER: ARTICLE BODY ═══ */}
                    <div className="article-body" style={{
                        minWidth: 0,
                    }}>
                        {post.content.map((block, i) => {
                            if (block.type === "heading") {
                                return (
                                    <h2
                                        key={i}
                                        id={`section-${i}`}
                                        data-heading
                                        style={{
                                            fontFamily: "'Playfair Display',serif",
                                            fontSize: "clamp(26px,3.2vw,36px)",
                                            fontWeight: 700,
                                            color: "var(--headline)",
                                            marginTop: "56px",
                                            marginBottom: "20px",
                                            lineHeight: 1.25,
                                            letterSpacing: "-0.015em",
                                            scrollMarginTop: "100px",
                                        }}>
                                        {block.text}
                                    </h2>
                                );
                            }
                            if (block.type === "subheading") {
                                return (
                                    <h3 key={i} style={{
                                        fontFamily: "'Playfair Display',serif",
                                        fontSize: "clamp(20px,2.4vw,26px)",
                                        fontWeight: 600,
                                        color: "var(--headline)",
                                        marginTop: "40px",
                                        marginBottom: "16px",
                                        lineHeight: 1.35,
                                        letterSpacing: "-0.01em",
                                    }}>
                                        {block.text}
                                    </h3>
                                );
                            }
                            if (block.type === "paragraph") {
                                // Drop cap for first paragraph
                                const isFirst = i === 0;
                                return (
                                    <p
                                        key={i}
                                        className={isFirst ? "drop-cap" : ""}
                                        style={{
                                            fontSize: "19px",
                                            lineHeight: 1.8,
                                            color: "var(--body)",
                                            marginBottom: "24px",
                                            fontWeight: 400,
                                            letterSpacing: "-0.003em",
                                        }}>
                                        {block.text}
                                    </p>
                                );
                            }
                            if (block.type === "list") {
                                return (
                                    <ul key={i} style={{
                                        margin: "16px 0 32px 0",
                                        paddingLeft: "0",
                                        listStyle: "none",
                                    }}>
                                        {block.items.map((item, j) => (
                                            <li key={j} style={{
                                                fontSize: "18px",
                                                lineHeight: 1.7,
                                                color: "var(--body)",
                                                marginBottom: "16px",
                                                paddingLeft: "36px",
                                                position: "relative",
                                            }}>
                                                <span style={{
                                                    position: "absolute",
                                                    left: "0",
                                                    top: "8px",
                                                    width: "20px",
                                                    height: "20px",
                                                    borderRadius: "50%",
                                                    background: "var(--primary-05)",
                                                    border: "2px solid var(--primary)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "10px",
                                                    fontWeight: 700,
                                                    color: "var(--primary)",
                                                }}>{j + 1}</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                );
                            }
                            if (block.type === "quote") {
                                return (
                                    <blockquote key={i} style={{
                                        margin: "48px 0",
                                        padding: "32px 36px",
                                        position: "relative",
                                        background: "linear-gradient(135deg, var(--primary-05), transparent)",
                                        borderRadius: "16px",
                                        borderLeft: "4px solid var(--primary)",
                                        fontFamily: "'Playfair Display',serif",
                                        fontSize: "clamp(20px,2.4vw,26px)",
                                        lineHeight: 1.5,
                                        fontStyle: "italic",
                                        color: "var(--headline)",
                                        fontWeight: 500,
                                    }}>
                                        <span style={{
                                            position: "absolute",
                                            top: "-12px",
                                            left: "24px",
                                            fontSize: "64px",
                                            fontFamily: "'Playfair Display',serif",
                                            color: "var(--primary)",
                                            lineHeight: 1,
                                            opacity: 0.4,
                                        }}>"</span>
                                        {block.text}
                                    </blockquote>
                                );
                            }
                            return null;
                        })}

                        {/* ═══ TAGS ═══ */}
                        <div style={{
                            marginTop: "64px",
                            paddingTop: "36px",
                            borderTop: "1px solid var(--border)",
                        }}>
                            <div style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: ".15em",
                                textTransform: "uppercase",
                                color: "var(--muted)",
                                marginBottom: "18px",
                            }}>
                                Tagged in
                            </div>
                            <div style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                            }}>
                                {post.tags.map(tag => (
                                    <span key={tag} style={{
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        color: "var(--body)",
                                        background: "var(--bg-section)",
                                        padding: "8px 16px",
                                        borderRadius: "100px",
                                        border: "1px solid var(--border)",
                                        transition: "all .3s ease",
                                        cursor: "default",
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = "var(--primary)";
                                            e.currentTarget.style.color = "var(--primary)";
                                            e.currentTarget.style.background = "var(--primary-05)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = "var(--border)";
                                            e.currentTarget.style.color = "var(--body)";
                                            e.currentTarget.style.background = "var(--bg-section)";
                                        }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ═══ AUTHOR CARD ═══ */}
                        <div style={{
                            marginTop: "48px",
                            padding: "32px",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "20px",
                            display: "flex",
                            gap: "20px",
                            alignItems: "flex-start",
                            boxShadow: "var(--shadow-sm)",
                        }} className="author-card">
                            <div style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, var(--primary), #8b4dd4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFFFFF",
                                fontWeight: 700,
                                fontSize: "24px",
                                flexShrink: 0,
                                boxShadow: "0 8px 24px rgba(75,30,120,0.3)",
                            }}>SC</div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: ".15em",
                                    textTransform: "uppercase",
                                    color: "var(--primary)",
                                    marginBottom: "6px",
                                }}>Written by</div>
                                <h4 style={{
                                    fontFamily: "'Playfair Display',serif",
                                    fontSize: "22px",
                                    fontWeight: 700,
                                    color: "var(--headline)",
                                    marginBottom: "8px",
                                }}>Stephen K. Curry</h4>
                                <p style={{
                                    fontSize: "14px",
                                    color: "var(--muted)",
                                    lineHeight: 1.6,
                                    marginBottom: "0",
                                }}>
                                    Founder, Endurance Advisory | Strategist & CEO | Crisis Operator | Web3 | AI | M&A | Early Stage Advisor & Investor | Former MD, Bank of America
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ═══ RIGHT: TABLE OF CONTENTS ═══ */}
                    <aside className="toc-sidebar" style={{
                        position: "relative",
                    }}>
                        {tocItems.length > 0 && (
                            <div style={{
                                position: "sticky",
                                top: "120px",
                            }}>
                                <div style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    letterSpacing: ".15em",
                                    textTransform: "uppercase",
                                    color: "var(--muted)",
                                    marginBottom: "16px",
                                    paddingBottom: "12px",
                                    borderBottom: "1px solid var(--border)",
                                }}>On this page</div>
                                <nav>
                                    {tocItems.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                                            }}
                                            style={{
                                                display: "block",
                                                fontSize: "13px",
                                                color: activeSection === item.id ? "var(--primary)" : "var(--muted)",
                                                fontWeight: activeSection === item.id ? 600 : 400,
                                                padding: "8px 12px",
                                                borderLeft: `2px solid ${activeSection === item.id ? "var(--primary)" : "transparent"}`,
                                                marginBottom: "2px",
                                                textDecoration: "none",
                                                transition: "all .3s ease",
                                                lineHeight: 1.4,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (activeSection !== item.id) {
                                                    e.currentTarget.style.color = "var(--body)";
                                                    e.currentTarget.style.borderLeftColor = "var(--border)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (activeSection !== item.id) {
                                                    e.currentTarget.style.color = "var(--muted)";
                                                    e.currentTarget.style.borderLeftColor = "transparent";
                                                }
                                            }}
                                        >
                                            {item.text}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </aside>
                </div>

                {/* ═══ RELATED ARTICLES ═══ */}
                {relatedPosts.length > 0 && (
                    <section style={{
                        background: "var(--bg-section)",
                        padding: "clamp(60px,9vh,110px) clamp(24px,6vw,80px)",
                        borderTop: "1px solid var(--border)",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        {/* Decorative background */}
                        <div style={{
                            position: "absolute",
                            top: "-100px",
                            right: "-100px",
                            width: "400px",
                            height: "400px",
                            background: "radial-gradient(circle, var(--primary-05), transparent 70%)",
                            pointerEvents: "none",
                        }} />

                        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
                            {/* Header */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                flexWrap: "wrap",
                                gap: "20px",
                                marginBottom: "48px",
                            }}>
                                <div>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        marginBottom: "16px",
                                    }}>
                                        <div style={{
                                            width: "32px", height: "2px",
                                            background: "var(--primary)",
                                        }} />
                                        <span style={{
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            letterSpacing: ".18em",
                                            textTransform: "uppercase",
                                            color: "var(--primary)",
                                        }}>Continue Reading</span>
                                    </div>
                                    <h3 style={{
                                        fontFamily: "'Playfair Display',serif",
                                        fontSize: "clamp(28px,3.5vw,42px)",
                                        fontWeight: 700,
                                        color: "var(--headline)",
                                        letterSpacing: "-0.02em",
                                        lineHeight: 1.15,
                                        marginBottom: "8px",
                                    }}>
                                        {relatedPosts.length === 1 ? "You might also like" : "Related Articles"}
                                    </h3>
                                    <p style={{
                                        fontSize: "16px",
                                        color: "var(--muted)",
                                        lineHeight: 1.5,
                                    }}>
                                        More insights from the {post.category} series
                                    </p>
                                </div>

                                <Link
                                    to="/#blog"
                                    style={{
                                        textDecoration: "none",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "var(--primary)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "10px 0",
                                        borderBottom: "1px solid transparent",
                                        transition: "all .3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderBottomColor = "var(--primary)";
                                        e.currentTarget.style.gap = "12px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderBottomColor = "transparent";
                                        e.currentTarget.style.gap = "8px";
                                    }}
                                >
                                    Browse all articles <span>→</span>
                                </Link>
                            </div>

                            {/* Adaptive Grid */}
                            <div className={`related-grid related-grid-${relatedPosts.length}`} style={{
                                display: "grid",
                                gap: "28px",
                                gridTemplateColumns: relatedPosts.length === 1
                                    ? "1fr"
                                    : relatedPosts.length === 2
                                        ? "repeat(2, 1fr)"
                                        : "repeat(3, 1fr)",
                            }}>
                                {relatedPosts.map((rp, idx) => (
                                    <RelatedArticleCard
                                        key={rp.id}
                                        post={rp}
                                        isHorizontal={relatedPosts.length === 1}
                                        index={idx}
                                    />
                                ))}
                            </div>

                            {/* Newsletter CTA */}
                            <div style={{
                                marginTop: "64px",
                                padding: "clamp(32px,5vw,56px)",
                                background: "linear-gradient(135deg, var(--primary) 0%, #3d1860 100%)",
                                borderRadius: "24px",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 20px 50px -10px rgba(75,30,120,0.4)",
                            }}>
                                {/* Decorative pattern */}
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                                    backgroundSize: "24px 24px",
                                    opacity: 0.5,
                                    pointerEvents: "none",
                                }} />
                                <div style={{
                                    position: "absolute",
                                    top: "-50px",
                                    right: "-50px",
                                    width: "250px",
                                    height: "250px",
                                    background: "radial-gradient(circle, rgba(139,77,212,0.4), transparent 70%)",
                                    pointerEvents: "none",
                                }} />

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "1.5fr 1fr",
                                    gap: "32px",
                                    alignItems: "center",
                                    position: "relative",
                                }} className="newsletter-grid">
                                    <div>
                                        <div style={{
                                            display: "inline-block",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            letterSpacing: ".15em",
                                            textTransform: "uppercase",
                                            color: "rgba(255,255,255,0.7)",
                                            background: "rgba(255,255,255,0.1)",
                                            padding: "6px 14px",
                                            borderRadius: "100px",
                                            marginBottom: "16px",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                        }}>
                                            ✉ Newsletter
                                        </div>
                                        <h4 style={{
                                            fontFamily: "'Playfair Display',serif",
                                            fontSize: "clamp(24px,3vw,32px)",
                                            fontWeight: 700,
                                            color: "#FFFFFF",
                                            lineHeight: 1.2,
                                            marginBottom: "12px",
                                            letterSpacing: "-0.015em",
                                        }}>
                                            What the Data Doesn't Say
                                        </h4>
                                        <p style={{
                                            fontSize: "15px",
                                            lineHeight: 1.6,
                                            color: "rgba(255,255,255,0.8)",
                                            marginBottom: "0",
                                        }}>
                                            Sharp analysis on banking, finance, AI, and the systems shaping our world. Delivered to your inbox.
                                        </p>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                    }}>
                                        <a
                                            href="https://www.linkedin.com/newsletters/what-the-data-doesn-t-say-7234567890/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                background: "#FFFFFF",
                                                color: "var(--primary)",
                                                fontSize: "15px",
                                                fontWeight: 700,
                                                padding: "16px 28px",
                                                borderRadius: "100px",
                                                textDecoration: "none",
                                                textAlign: "center",
                                                transition: "all .3s ease",
                                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                                            }}
                                        >
                                            Subscribe on LinkedIn →
                                        </a>
                                        <div style={{
                                            fontSize: "12px",
                                            color: "rgba(255,255,255,0.6)",
                                            textAlign: "center",
                                        }}>
                                            Join 750+ subscribers
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══ BACK TO BLOG CTA ═══ */}
                <div style={{
                    padding: "clamp(48px,7vh,80px) 24px",
                    textAlign: "center",
                    background: "var(--bg)",
                }}>
                    <Link to="/#blog" className="btn btn-primary" style={{
                        textDecoration: "none",
                        padding: "14px 32px",
                        fontSize: "15px",
                    }}>
                        ← View all articles
                    </Link>
                </div>
            </article>

            {/* ═══ MOBILE FLOATING SHARE ═══ */}
            <button
                className="mobile-share-fab"
                onClick={() => setShowToc(!showToc)}
                aria-label="Share menu"
                style={{
                    display: "none",
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#FFFFFF",
                    border: "none",
                    boxShadow: "0 8px 24px rgba(75,30,120,0.4)",
                    cursor: "pointer",
                    fontSize: "20px",
                    zIndex: 100,
                    transition: "transform .3s ease",
                }}
            >
                ↗
            </button>

            {showToc && (
                <div
                    onClick={() => setShowToc(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 99,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "var(--bg)",
                            padding: "24px",
                            borderRadius: "20px 20px 0 0",
                            width: "100%",
                            maxWidth: "500px",
                        }}
                    >
                        <div style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: ".15em",
                            textTransform: "uppercase",
                            color: "var(--muted)",
                            marginBottom: "16px",
                        }}>Share this article</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
                            <MobileShareBtn icon="𝕏" label="Twitter" onClick={() => { handleShare("twitter"); setShowToc(false); }} />
                            <MobileShareBtn icon="in" label="LinkedIn" onClick={() => { handleShare("linkedin"); setShowToc(false); }} />
                            <MobileShareBtn icon="f" label="Facebook" onClick={() => { handleShare("facebook"); setShowToc(false); }} />
                            <MobileShareBtn icon="🔗" label="Copy" onClick={() => { handleShare("copy"); setShowToc(false); }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ STYLES ═══ */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Drop cap */
                .drop-cap::first-letter {
                    font-family: 'Playfair Display', serif;
                    font-size: 5em;
                    font-weight: 700;
                    float: left;
                    line-height: 0.85;
                    margin: 8px 12px 0 0;
                    color: var(--primary);
                }

                /* Tablet */
                @media (max-width: 1100px) {
                    .article-layout {
                        grid-template-columns: 80px minmax(0, 1fr) !important;
                    }
                    .toc-sidebar { display: none !important; }
                }

                /* Related Articles Grid */
                @media (max-width: 900px) {
                    .related-grid-3 {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                    .newsletter-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 700px) {
                    .related-grid-2,
                    .related-grid-3 {
                        grid-template-columns: 1fr !important;
                    }
                    .related-card {
                        grid-template-columns: 1fr !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .article-layout {
                        grid-template-columns: 1fr !important;
                        gap: 0 !important;
                    }
                    .share-sidebar { display: none !important; }
                    .mobile-share-fab { display: flex !important; align-items: center; justify-content: center; }
                    .article-hero { text-align: left !important; }
                    .author-card { flex-direction: column !important; }
                    .drop-cap::first-letter {
                        font-size: 4em;
                    }
                }
            `}</style>
        </>
    );
}

// ═══════════════════════════════════════════════════════════
// SHARE BUTTON (Desktop sidebar)
// ═══════════════════════════════════════════════════════════
function ShareButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            title={label}
            style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--body)",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .3s ease",
                boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.transform = "translateX(-4px) scale(1.05)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-card)";
                e.currentTarget.style.color = "var(--body)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateX(0) scale(1)";
            }}
        >
            {icon}
        </button>
    );
}

// ═══════════════════════════════════════════════════════════
// MOBILE SHARE BUTTON
// ═══════════════════════════════════════════════════════════
function MobileShareBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px 8px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
            }}
        >
            <span style={{ fontSize: "20px", fontWeight: 700 }}>{icon}</span>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>{label}</span>
        </button>
    );
}

// ═══════════════════════════════════════════════════════════
// RELATED ARTICLE CARD (Adaptive: Horizontal or Vertical)
// ═══════════════════════════════════════════════════════════
function RelatedArticleCard({
    post,
    isHorizontal,
    index,
}: {
    post: typeof blogPosts[0];
    isHorizontal: boolean;
    index: number;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={`/blog/${post.slug}`}
            style={{ textDecoration: "none" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <article
                className="related-card"
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    height: "100%",
                    transition: "all .5s cubic-bezier(.16,1,.3,1)",
                    cursor: "pointer",
                    display: isHorizontal ? "grid" : "flex",
                    flexDirection: isHorizontal ? undefined : "column",
                    gridTemplateColumns: isHorizontal ? "1.1fr 1fr" : undefined,
                    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: isHovered
                        ? "0 24px 60px -12px rgba(75,30,120,0.3)"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                    borderColor: isHovered ? "var(--primary)" : "var(--border)",
                    animation: `fadeInUp 0.6s ease ${0.1 * index}s both`,
                }}
            >
                {/* Image */}
                <div style={{
                    position: "relative",
                    height: isHorizontal ? "auto" : "220px",
                    minHeight: isHorizontal ? "260px" : "220px",
                    overflow: "hidden",
                    background: "var(--bg-section)",
                }}>
                    <img
                        src={post.image}
                        alt={post.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform .8s cubic-bezier(.16,1,.3,1)",
                            transform: isHovered ? "scale(1.08)" : "scale(1)",
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                    {/* Gradient overlay */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4))",
                        pointerEvents: "none",
                        opacity: isHovered ? 0.7 : 1,
                        transition: "opacity .4s ease",
                    }} />

                    {/* Category badge on image */}
                    <div style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: categoryColors[post.category] || "var(--primary)",
                        padding: "6px 14px",
                        borderRadius: "100px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}>
                        {post.category}
                    </div>

                    {/* Read time pill on image */}
                    <div style={{
                        position: "absolute",
                        bottom: "16px",
                        right: "16px",
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: "100px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}>
                        ⏱ {post.readTime}
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    padding: isHorizontal ? "clamp(28px,4vw,44px)" : "28px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: isHorizontal ? "center" : "flex-start",
                }}>
                    {/* Date */}
                    <div style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--muted)",
                        marginBottom: "12px",
                        letterSpacing: ".05em",
                    }}>
                        {post.date}
                    </div>

                    {/* Title */}
                    <h4 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: isHorizontal ? "clamp(22px,2.6vw,28px)" : "20px",
                        fontWeight: 700,
                        color: isHovered ? "var(--primary)" : "var(--headline)",
                        lineHeight: 1.25,
                        marginBottom: "14px",
                        letterSpacing: "-0.015em",
                        transition: "color .3s ease",
                        display: "-webkit-box",
                        WebkitLineClamp: isHorizontal ? 3 : 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}>
                        {post.title}
                    </h4>

                    {/* Excerpt (only for horizontal) */}
                    {isHorizontal && (
                        <p style={{
                            fontSize: "15px",
                            lineHeight: 1.65,
                            color: "var(--muted)",
                            marginBottom: "20px",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}>
                            {post.excerpt}
                        </p>
                    )}

                    {/* Footer with tags + arrow */}
                    <div style={{
                        marginTop: isHorizontal ? "0" : "auto",
                        paddingTop: isHorizontal ? "0" : "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                    }}>
                        {/* Tags */}
                        <div style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                            flex: 1,
                            minWidth: 0,
                        }}>
                            {post.tags.slice(0, 2).map(tag => (
                                <span key={tag} style={{
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: "var(--muted)",
                                    background: "var(--bg-section)",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    whiteSpace: "nowrap",
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Arrow */}
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: isHovered ? "var(--primary)" : "var(--primary-05)",
                            color: isHovered ? "#FFFFFF" : "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: 600,
                            transition: "all .4s cubic-bezier(.16,1,.3,1)",
                            transform: isHovered ? "translateX(4px) rotate(-45deg)" : "translateX(0) rotate(0)",
                            flexShrink: 0,
                        }}>
                            →
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}