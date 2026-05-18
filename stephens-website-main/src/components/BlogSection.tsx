import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    blogPosts,
    categoryColors,
    categoryGradients,
    categoryIcons,
    type BlogPost,
} from "../data/blogPosts";

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

            {/* ═══ FEATURED POST ═══ */}
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
    post: BlogPost;
    isVisible: boolean;
    isHovered: boolean;
    onHover: (id: number | null) => void;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const cardRef = useRef<HTMLDivElement>(null);

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
        <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}
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
                    backgroundColor: "#140a24",
                }}>
                    <img
                        src={post.image}
                        alt={post.title}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        style={{
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            objectPosition: "left center",
                            opacity: imageLoaded ? 1 : 0,
                            transition: "opacity .5s ease, transform .4s ease",
                            transform: isHovered ? `scale(1.05) translate(${(mousePos.x - 0.5) * -6}px, ${(mousePos.y - 0.5) * -6}px)` : "scale(1)",
                        }}
                    />
                    {!imageLoaded && <BlogImagePlaceholder category={post.category} />}

                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(135deg, rgba(75,30,120,0.08) 0%, transparent 100%)",
                        pointerEvents: "none",
                    }} />

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

                    <h3 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "clamp(24px,3vw,32px)",
                        fontWeight: 700,
                        color: isHovered ? "var(--primary)" : "var(--headline)",
                        lineHeight: 1.25,
                        marginBottom: "16px",
                        transition: "color .3s ease",
                    }}>{post.title}</h3>

                    <p style={{
                        fontSize: "16px",
                        lineHeight: 1.7,
                        color: "var(--body)",
                        marginBottom: "24px",
                    }}>{post.excerpt}</p>

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
                        paddingTop: "20px",
                        borderTop: "1px solid var(--border)",
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}>
                            <span style={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "var(--primary)",
                                letterSpacing: ".02em",
                            }}>
                                Read full article
                            </span>
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
                            }}>
                                →
                            </div>
                        </div>
                        <span style={{
                            fontSize: "12px",
                            color: "var(--muted)",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}>
                            <span>⏱</span>
                            {post.readTime}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ═══════════════════════════════════════════════════════════
// BLOG CARD (Premium Design)
// ═══════════════════════════════════════════════════════════
function BlogCard({ post, index, isVisible, isHovered, onHover }: {
    post: BlogPost;
    index: number;
    isVisible: boolean;
    isHovered: boolean;
    onHover: (id: number | null) => void;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const delay = 0.35 + index * 0.08;

    return (
        <Link
            to={`/blog/${post.slug}`}
            style={{ textDecoration: "none", display: "block", height: "100%" }}
            onMouseEnter={() => onHover(post.id)}
            onMouseLeave={() => onHover(null)}
        >
            <article
                style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${isHovered ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "20px",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: isHovered
                        ? "0 24px 60px -12px rgba(75,30,120,0.28)"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                    transform: isHovered
                        ? "translateY(-10px)"
                        : (isVisible ? "translateY(0)" : "translateY(40px)"),
                    opacity: isVisible ? 1 : 0,
                    transition: `
                        opacity .7s ease ${delay}s,
                        transform .6s cubic-bezier(.16,1,.3,1) ${isHovered ? '0s' : delay + 's'},
                        border-color .3s ease,
                        box-shadow .4s ease
                    `,
                    position: "relative",
                }}
            >
                {/* ═══ IMAGE SECTION ═══ */}
                <div style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    background: "#140a24",
                }}>
                    <img
                        src={post.image}
                        alt={post.title}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: imageLoaded ? 1 : 0,
                            transition: "opacity .5s ease, transform .8s cubic-bezier(.16,1,.3,1)",
                            transform: isHovered ? "scale(1.08)" : "scale(1)",
                        }}
                    />
                    {!imageLoaded && <BlogImagePlaceholder category={post.category} />}

                    {/* Gradient overlay */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)",
                        pointerEvents: "none",
                        opacity: isHovered ? 1 : 0.85,
                        transition: "opacity .4s ease",
                    }} />

                    {/* Category badge */}
                    <div style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(255,255,255,0.96)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: categoryColors[post.category] || "var(--primary)",
                        padding: "7px 14px",
                        borderRadius: "100px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}>
                        <span style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: categoryColors[post.category] || "var(--primary)",
                        }} />
                        {post.category}
                    </div>

                    {/* Read time badge */}
                    <div style={{
                        position: "absolute",
                        bottom: "16px",
                        right: "16px",
                        background: "rgba(0,0,0,0.65)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderRadius: "100px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        letterSpacing: ".02em",
                    }}>
                        <span style={{ fontSize: "10px" }}>⏱</span>
                        {post.readTime}
                    </div>
                </div>

                {/* ═══ CONTENT SECTION ═══ */}
                <div style={{
                    padding: "26px 26px 22px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                }}>
                    {/* Date */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--muted)",
                        marginBottom: "14px",
                        letterSpacing: ".03em",
                    }}>
                        <span style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: "var(--primary)",
                        }} />
                        {post.date}
                    </div>

                    {/* Title */}
                    <h3 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: "clamp(19px,2vw,22px)",
                        fontWeight: 700,
                        color: isHovered ? "var(--primary)" : "var(--headline)",
                        lineHeight: 1.3,
                        marginBottom: "12px",
                        transition: "color .3s ease",
                        letterSpacing: "-0.015em",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
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
                        marginBottom: "20px",
                    }}>
                        {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                color: "var(--muted)",
                                background: "var(--bg-section)",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                border: "1px solid var(--border)",
                                letterSpacing: ".02em",
                            }}>{tag}</span>
                        ))}
                    </div>

                    {/* Footer: Read more + Arrow */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "16px",
                        borderTop: "1px solid var(--border)",
                        marginTop: "auto",
                    }}>
                        <span style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "var(--primary)",
                            letterSpacing: ".02em",
                            transition: "all .3s ease",
                        }}>
                            Read article
                        </span>

                        <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: isHovered ? "var(--primary)" : "var(--primary-05)",
                            color: isHovered ? "#FFFFFF" : "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                            transition: "all .4s cubic-bezier(.16,1,.3,1)",
                            transform: isHovered ? "translateX(2px) rotate(-45deg)" : "translateX(0) rotate(0)",
                        }}>
                            →
                        </div>
                    </div>
                </div>

                {/* Hover accent line at top */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, var(--primary), #8b4dd4, var(--primary))",
                    transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform .5s cubic-bezier(.16,1,.3,1)",
                    pointerEvents: "none",
                }} />
            </article>
        </Link>
    );
}

// ═══════════════════════════════════════════════════════════
// BLOG IMAGE PLACEHOLDER
// ═══════════════════════════════════════════════════════════
function BlogImagePlaceholder({ category }: { category: string }) {
    return (
        <div style={{
            position: "absolute", inset: 0,
            background: categoryGradients[category] || categoryGradients["Digital Banking"],
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }} />
            <span style={{
                fontSize: "48px",
                color: "rgba(255,255,255,0.15)",
                marginBottom: "8px",
            }}>{categoryIcons[category] || "◎"}</span>
            <span style={{
                fontSize: "11px", fontWeight: 600,
                letterSpacing: ".15em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
            }}>{category}</span>
        </div>
    );
}