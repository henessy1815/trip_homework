import styles from "./styles.module.css";

type HeroBannerProps = {
  small?: boolean;
  showText?: boolean;
};

export default function HeroBanner({
  small = false,
  showText = true,
}: HeroBannerProps) {
  return (
    <section
      className={`${styles.hero} ${small ? styles.small : ""}`}
      aria-label="해변 여행 배너"
    >
      {/* 메인 화면의 큰 배너에만 여행 문구를 보여줘요. */}
      {!small && showText && (
        <div className={styles.textBox}>
          <p>여행이 시작되는 순간</p>
          <h1>트립트립과 함께 특별한 이야기를 만들어보세요.</h1>
        </div>
      )}

      <div className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
