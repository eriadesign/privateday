// Gera css/tailwind.css com as classes usadas na página. O comando está no README.
module.exports = {
    content: { relative: true, files: ['./index.htm', './js/*.js'] },
    theme: {
        extend: {
            // Paleta da festa (guia de identidade). As mesmas cores estão em :root, no estilos.css.
            colors: { mato: '#758c39', mar: '#88bddd', areia: '#fee7d8', canario: '#ffa737', caju: '#fc5447', cacau: '#281a16' }
        }
    }
};
