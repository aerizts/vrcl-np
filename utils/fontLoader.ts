export const loadSTZhongsongFont = async () => {
  return new Promise<boolean>((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    const font = new FontFace('STZhongsong', 'url(/fonts/STZhongsong.ttf)');
    font.load().then(() => {
      document.fonts.add(font);
      document.documentElement.classList.add('fonts-loaded');
      console.log('STZhongsong font loaded successfully');
      resolve(true);
    }).catch((error) => {
      console.warn('STZhongsong font loading failed, falling back to system fonts:', error);
      document.documentElement.classList.add('fonts-failed');
      resolve(false);
    });
  });
};

