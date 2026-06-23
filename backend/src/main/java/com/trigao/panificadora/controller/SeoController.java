package com.trigao.panificadora.controller;

import com.trigao.panificadora.model.Product;
import com.trigao.panificadora.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.Normalizer;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SeoController {

    private final ProductRepository productRepository;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap() {
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        String base = frontendUrl.replaceAll("/+$", "");
        DateTimeFormatter fmt = DateTimeFormatter.ISO_DATE;

        addUrl(sb, base + "/",          "1.0", "daily");
        addUrl(sb, base + "/cardapio",  "0.9", "daily");
        addUrl(sb, base + "/#sobre",    "0.6", "monthly");
        addUrl(sb, base + "/#contato",  "0.6", "monthly");

        List<Product> all = productRepository.findByActiveTrueOrderByNameAsc(
                org.springframework.data.domain.PageRequest.of(0, 500)).getContent();
        for (Product p : all) {
            String slug = slugify(p.getName()) + "-" + p.getId();
            String url = base + "/cardapio/" + slug;
            sb.append("  <url>\n");
            sb.append("    <loc>").append(escape(url)).append("</loc>\n");
            if (p.getUpdatedAt() != null) {
                sb.append("    <lastmod>")
                  .append(p.getUpdatedAt().atZone(java.time.ZoneId.of("America/Fortaleza")).toLocalDate().format(fmt))
                  .append("</lastmod>\n");
            }
            sb.append("    <changefreq>weekly</changefreq>\n");
            sb.append("    <priority>0.7</priority>\n");
            sb.append("  </url>\n");
        }

        sb.append("</urlset>\n");
        return ResponseEntity.ok(sb.toString());
    }

    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> robots() {
        String base = frontendUrl.replaceAll("/+$", "");
        String body = "User-agent: *\n" +
                      "Allow: /\n" +
                      "Disallow: /admin\n" +
                      "Disallow: /gerente\n" +
                      "Disallow: /sacola\n" +
                      "Disallow: /checkout\n" +
                      "Disallow: /meus-pedidos\n" +
                      "Disallow: /login\n" +
                      "Disallow: /cadastro\n" +
                      "Sitemap: " + base + "/sitemap.xml\n";
        return ResponseEntity.ok(body);
    }

    private void addUrl(StringBuilder sb, String url, String priority, String changefreq) {
        sb.append("  <url>\n")
          .append("    <loc>").append(escape(url)).append("</loc>\n")
          .append("    <changefreq>").append(changefreq).append("</changefreq>\n")
          .append("    <priority>").append(priority).append("</priority>\n")
          .append("  </url>\n");
    }

    private String escape(String s) {
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("'", "&apos;")
                .replace("\"", "&quot;");
    }

    private String slugify(String s) {
        if (s == null) return "";
        String normalized = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return normalized;
    }
}
